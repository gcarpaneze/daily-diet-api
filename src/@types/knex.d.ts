/* eslint-disable */
import { Knex } from 'knex'

export interface User {
  id?: string
  name: string
  email: string
  created_at?: string
}

export interface DailyMeals {
  id: string
  name: string
  description: string
  isDiet: boolean
  created_at: string
  user_id: string
}

declare module 'knex/types/tables' {

  interface Tables {
    users: User
    daily_meals: DailyMeals
  }
}
