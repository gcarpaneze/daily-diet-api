import Fastify from 'fastify'
import cookie from '@fastify/cookie'

import { userRoutes } from './routes/user-routes'
import { dailyMealsRoutes } from './routes/daily-meals-routes'

export const app = Fastify()

app.register(cookie)

app.register(userRoutes, {
  prefix: '/user',
})
app.register(dailyMealsRoutes, {
  prefix: '/daily-meals',
})
