// eslint-disable-next-line no-unused-vars
import Knex from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.createTable('users', function (table) {
    table.string('username').primary();
    table.string('password').notNullable();
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.dropTable('users');
};
