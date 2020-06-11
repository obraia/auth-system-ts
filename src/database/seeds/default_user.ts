// eslint-disable-next-line no-unused-vars
import Knex from 'knex';

export async function seed (knex: Knex) {
  await knex('users').insert([
    { username: 'admin', password: 'admin' }
  ]);
}
