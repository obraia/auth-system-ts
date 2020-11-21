import express from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from './routes';

const app = express();
app.use(compression());
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(routes);

export { app };
