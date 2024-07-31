exports.up = function (knex) {
    return knex.schema.createTable('relays', (table) => {
      table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'))
      table.binary('pubkey').primary().notNullable().index()
      table.text('name').notNullable().index()
      table.text('url').notNullable().index()
      table.text('pricing').notNullable().index()
      table.text('description').notNullable().index()
      table.jsonb('contactDetail').notNullable().index()
      table.jsonb('latitudeRange').notNullable().index()
      table.jsonb('longitudeRange').notNullable().index()
      // table.double('longitudeMin').notNullable().index()
      // table.double('longitudeMax').notNullable().index()
    })
  }
  
exports.down = function (knex) {
    return knex.schema.dropTable('relays')
  }
  