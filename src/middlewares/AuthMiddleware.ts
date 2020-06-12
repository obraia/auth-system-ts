// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express';

import path from 'path';
import fs from 'fs';

import jwt from 'jsonwebtoken';

class AuthMiddleware {
  authenticate (req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ error: 'No token provided' });
    }

    // Formato do token: Bearer + hash

    const parts = authHeader.split(' ');

    if (!(parts.length === 2)) {
      return res.status(401).send({ error: 'Invalid token formart' });
    }

    const [scheme, token] = parts;

    // Verificando se existe a palavra Bearer na constante scheme

    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).send({ error: 'Invalid token scheme' });
    }

    const keyPath = path.join(__dirname, '../', 'config', 'keys', 'public.pem');
    const publicKey = fs.readFileSync(keyPath, 'utf8');

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).send({ error: 'Token invalid' });
      }

      req.body.username = decoded.id;

      return next();
    });
  }
}

export default AuthMiddleware;
