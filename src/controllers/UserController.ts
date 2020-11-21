// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// eslint-disable-next-line no-unused-vars
import { IController } from '../interfaces/IController';
import { UserRepository } from '../repositories/UserRepository';
import { CustomError } from '../utils/CustomError';

dotenv.config();

class UserController implements IController {
  async index (req: Request, res: Response) {
    return res.status(501).json({ message: 'Not implemented' });
  }

  async create (req: Request, res: Response) {
    const { username, password } = req.body;
    const userRepository = new UserRepository();

    try {
      const user = await userRepository.index(username);

      if (user) throw new CustomError('User already exists', 409);

      const saltRounds = parseInt(String(process.env.SALT_ROUNDS));
      const salt = await bcrypt.genSalt(saltRounds);
      const hashPassword = await bcrypt.hash(password, salt);

      await userRepository.create({
        username,
        password: hashPassword
      });

      return res.status(201).json({ message: 'success' });
    } catch (err) {
      return res.status(err.status).json({ message: err.message });
    }
  }

  async update (req: Request, res: Response) {
    return res.status(501).json({ message: 'Not implemented' });
  }

  async delete (req: Request, res: Response) {
    const { username } = req.params;
    const userRepository = new UserRepository();

    try {
      const user = await userRepository.index(username);

      if (!user) throw new CustomError('User not found', 404);

      await userRepository.delete(username);

      return res.status(201).json({ message: 'success' });
    } catch (err) {
      return res.status(err.status).json({ message: err.message });
    }
  }
}

export { UserController };
