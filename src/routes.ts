import express from 'express';

import { UserController } from './controllers/UserController';
import { SessionController } from './controllers/SessionController';
import { AuthMiddleware } from './middlewares/AuthMiddleware';

const routes = express.Router();

const userController = new UserController();
const sessionController = new SessionController();
const authMiddleware = new AuthMiddleware();

routes.delete('/users/:username', authMiddleware.authenticate, userController.delete);
routes.post('/register', userController.create);
routes.post('/authenticate', sessionController.create);

export { routes };
