import { z } from 'zod'
import { config } from 'dotenv'

config()

const envSchema = z.object({
  PORT: z.coerce.number({
    required_error: 'PORT is required in .env file',
    invalid_type_error: 'PORT must be a string in .env file',
  }),
  BASE_URL: z.string({
    required_error: 'BASE_URL is required in .env file',
    invalid_type_error: 'BASE_URL must be a string in .env file',
  }),
})

const _env = envSchema.parse(process.env)

export const env = _env
