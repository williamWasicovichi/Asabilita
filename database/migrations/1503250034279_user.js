'use strict'

const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('last_name', 100).notNullable()
      table.date('birthday').notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('cpf', 15).notNullable().unique()
      table.string('password', 60).notNullable()
      table.enum('role', [
        'NORMAL',
        'EMPLOYEE',
        'MANAGER',
        'ADMIN'
      ]).notNullable().defaultsTo('NORMAL')
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
