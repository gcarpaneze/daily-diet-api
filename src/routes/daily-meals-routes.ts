import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkSessionIdExist } from '../middlewares/check-session-id-exist'

export async function dailyMealsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', async (request, reply) => {
    await checkSessionIdExist(request, reply)
  })

  app.get('/', async (request, reply) => {
    const { userId } = request.cookies

    const data = await knex('daily_meals')
      .select('id', 'name', 'description', 'isDiet')
      .where('user_id', userId)

    return reply.status(200).send({
      meals: data,
    })
  })

  app.get('/:mealId', async (request, reply) => {
    const { userId } = request.cookies

    const paramsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { mealId } = paramsSchema.parse(request.params)

    const data = await knex('daily_meals')
      .select('id', 'name', 'description', 'isDiet')
      .where({
        id: mealId,
        user_id: userId,
      })

    return reply.status(200).send({
      meals: data,
    })
  })

  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const { userId } = request.cookies

    const { name, description, isDiet } = bodySchema.parse(request.body)

    await knex('daily_meals').insert({
      name,
      description,
      isDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.put('/:mealId', async (request, reply) => {
    const paramsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { mealId } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      isDiet: z.boolean(),
    })

    const { name, description, isDiet } = bodySchema.parse(request.body)

    await knex('daily_meals').where('id', mealId).update({
      name,
      description,
      isDiet,
    })

    return reply.status(204).send()
  })

  app.delete('/:mealId', async (request, reply) => {
    const paramsSchema = z.object({
      mealId: z.string().uuid(),
    })

    const { mealId } = paramsSchema.parse(request.params)

    const mealDeleted = await knex('daily_meals').where('id', mealId).delete()

    if (mealDeleted === 0) {
      return reply.status(404).send({
        error: 'Not found. Maybe was already deleted',
      })
    } else {
      return reply.status(200).send()
    }
  })

  app.get('/summary', async (request, reply) => {
    const { userId } = request.cookies

    const data = await knex('daily_meals')
      .where('user_id', userId)
      .select('id', 'name', 'description', 'isDiet')
      .orderBy('created_at', 'asc')

    const meals = data.reduce(
      (acc, cur) => {
        // Count All Meals
        acc.allMeals += 1

        // Count Diet and Not Diet Meals
        if (Boolean(cur.isDiet) === true) {
          acc.onlyDietMeals += 1
        } else {
          acc.onlyNotDietMeals += 1
        }

        // Count best sequence of Diet Meals
        if (Boolean(cur.isDiet) === true) {
          acc.currentSequenceDietMeal += 1

          if (acc.currentSequenceDietMeal > acc.bestSequenceDietMeals) {
            acc.bestSequenceDietMeals = acc.currentSequenceDietMeal
          }
        } else {
          acc.currentSequenceDietMeal = 0
        }

        return acc
      },
      {
        allMeals: 0,
        onlyDietMeals: 0,
        onlyNotDietMeals: 0,
        bestSequenceDietMeals: 0,
        currentSequenceDietMeal: 0,
      },
    )

    return reply.status(200).send({
      allMeals: meals.allMeals,

      onlyDietMeals: meals.onlyDietMeals,

      onlyNotDietMeals: meals.onlyNotDietMeals,

      bestSequenceDietMeals: meals.bestSequenceDietMeals,
    })
  })
}
