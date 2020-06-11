// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import 'dotenv';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import knex from '../database/connection';

class SessionController {
  async create (req: Request, res: Response) {
    const { username, password, rememberMe } = req.body;

    const user: User = await knex('users')
      .where('username', username)
      .select('*')
      .first()
      .catch((err: any) => {
        console.log(err);
      });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    delete user.password;

    const keyPath = path.join(__dirname, '../', 'config', 'private.pem');
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
          expiresIn: 7200 // --> 2 hours
        });
    };

    return res.status(200).json({ user, token });
  }

  async update (req: Request, res: Response) {
    res.status(501).json({ message: 'Not implemented' });
  }

  async delete (req: Request, res: Response) {
    res.status(501).json({ message: 'Not implemented' });
  }
}

export default SessionController;
