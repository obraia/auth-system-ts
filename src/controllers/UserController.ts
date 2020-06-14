// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';

import bcrypt from 'bcrypt';

import knex from '../database/connection';

dotenv.config();

class UserController {
  async create (req: Request, res: Response) {
    const { username, password } = req.body;

    const user = await knex('users')
      .where('username', username)
      .select('username')
      .first();

    if (user) {
      return res.status(409).json('User already exists');
    }

    const saltRounds = parseInt(String(process.env.SALT_ROUNDS));

    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);

    await knex('users').insert({
      username,
      password: hash
    });

    return res.status(201).json({ message: 'success' });
  }

  async update (req: Request, res: Response) {
    return res.status(501).json({ message: 'Not implemented' });
  }

  async delete (req: Request, res: Response) {
    const { username } = req.params;

    const user = await knex('users')
      .where('username', username)
      .select('username')
      .first();

    if (!user) {
      return res.status(404).json('User not found');
    }

    await knex('users').where('username', username).del();

    return res.status(201).json({ message: 'success' });
  }
}

export default UserController;
