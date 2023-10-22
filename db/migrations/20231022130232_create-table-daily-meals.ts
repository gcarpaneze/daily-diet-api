import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('daily_meals', (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid())
    table.string('name').notNullable()
    table.string('description').notNullable()
    table.boolean('isDiet').notNullable()
    table.dateTime('created_at').defaultTo(knex.fn.now())
    table.uuid('user_id').notNullable().index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('daily_meals')
}
