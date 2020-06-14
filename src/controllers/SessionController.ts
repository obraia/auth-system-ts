// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import knex from '../database/connection';

dotenv.config();

class SessionController {
  async create (req: Request, res: Response) {
    const { username, password, rememberMe } = req.body;

    const user = await knex('users')
      .where('username', username)
      .select('*')
      .first();

    if (!user) {
      return res.status(404).json('User not found');
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json('Incorrect password');
    }

    delete user.password;

    const keyPath = path.join(__dirname, '../', 'config', 'keys', 'private.pem');
    const privateKey = fs.readFileSync(keyPath, 'utf8');

    let token;

    if (rememberMe) {
      token = jwt.sign({ id: user.username },
        { key: privateKey, passphrase: String(process.env.PASS_PHRASE) }, {
          expiresIn: 2592000, // --> 30 days
          algorithm: 'RS256'
        });
    } else {
      token = jwt.sign({ id: user.username },
        { key: privateKey, passphrase: String(process.env.PASS_PHRASE) }, {
          expiresIn: 7200, // --> 2 hours
          algorithm: 'RS256'
        });
    };

    return res.status(200).json({ username: user.username, token });
  }

  async update (req: Request, res: Response) {
    return res.status(501).json({ message: 'Not implemented' });
  }

  async delete (req: Request, res: Response) {
    return res.status(501).json({ message: 'Not implemented' });
  }
}

export default SessionController;
