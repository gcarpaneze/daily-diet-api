import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function userRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = bodySchema.parse(request.body)

    const hasEmailAlreadyExist = await knex('users')
      .where('email', email)
      .first()

    if (hasEmailAlreadyExist) {
      return reply.status(400).send({ error: 'email is already exist' })
    }

    await knex('users')
      .insert(
        {
          name,
          email,
        },
        ['id'],
      )
      .then(([{ id }]) => {
        if (id) {
          reply.cookie('userId', id, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
          })
        }
      })

    return reply.status(201).send()
  })
}
