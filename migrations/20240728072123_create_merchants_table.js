exports.up = function (knex) {
    return knex.schema.createTable('merchants', (table) => {
      table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'))
      table.binary('pubkey').primary().notNullable().index()
      table.text('name').notNullable().index()
      table.text('description').notNullable().index()
      table.text('pricing').notNullable().index()
      table.json('contactDetail').notNullable().index()
      table.double('latitude').notNullable().index()
      table.double('longitude').notNullable().index()
      table.double('balance').defaultTo(0.0).index()
      table.date('advertisedOn').defaultTo(null).index()
      table.boolean('isAdvertised').defaultTo(true).index()
    })
  }
  
  exports.down = function (knex) {
    return knex.schema.dropTable('merchants')
  }
  