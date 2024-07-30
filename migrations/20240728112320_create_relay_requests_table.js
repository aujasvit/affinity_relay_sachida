exports.up = function (knex) {
    return knex.schema.createTable('relay_requests', (table) => {
      table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()'))
      table.binary('pubkey').primary().notNullable().index()
      table.json('senderPubkeys').notNullable().index()
      table.text('name').notNullable().index()
      table.text('url').notNullable().index()
      table.text('pricing').notNullable().index()
      table.text('description').notNullable().index()
      table.json('contactDetail').notNullable().index()
      table.double('latitudeMin').notNullable().index()
      table.double('latitudeMax').notNullable().index()
      table.double('longitudeMin').notNullable().index()
      table.double('longitudeMax').notNullable().index()
    })
  }
  
  exports.down = function (knex) {
    return knex.schema.dropTable('relay_requests')
  }
  