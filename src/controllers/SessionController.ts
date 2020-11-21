/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IController } from '../interfaces/IController';
import { UserRepository } from '../repositories/UserRepository';
import { CustomError } from '../utils/CustomError';
dotenv.config();

class SessionController implements IController {
  async index (req: Request, res: Response) {
    return res.status(501).json({ message: 'Not implemented' });
  }

  async create (req: Request, res: Response) {
    const { username, password, rememberMe } = req.body;

    const userRepository = new UserRepository();
    let token = '';
    let expiresIn = '2h';

    try {
      const user = await userRepository.index(username);

      if (!user) throw new CustomError('User not found', 404);

      if (!await bcrypt.compare(password, user.password)) {
        throw new CustomError('Incorrect password', 401);
      }

      delete user.password;

      const keyPath = path.join(__dirname, '../', 'config', 'keys', 'private.pem');
      const privateKey = fs.readFileSync(keyPath, 'utf8');

      if (rememberMe) expiresIn = '30d';

      token = jwt.sign(
        { id: user.username },
        { key: privateKey, passphrase: String(process.env.PASS_PHRASE) },
        { expiresIn: expiresIn, algorithm: 'RS256' }
      );

      return res.status(200).json({ username: user.username, token });
    } catch (err) {
      return res.status(err.status).json({ message: err.message });
    }
  }

  async update (req: Request, res: Response) {
    return res.status(501).json({ message: 'Not implemented' });
  }

  async delete (req: Request, res: Response) {
    return res.status(501).json({ message: 'Not implemented' });
  }
}

export { SessionController };
