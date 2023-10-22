import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkSessionIdExist(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { userId } = request.cookies

  if (!userId) {
    return reply.status(401).send({
      error: 'Unathorized.',
    })
  }

  const hasUserWithId = await knex('users').first().where('id', userId)

  if (!hasUserWithId) {
    return reply.status(401).send({
      error: 'Unathorized.',
    })
  }
}
