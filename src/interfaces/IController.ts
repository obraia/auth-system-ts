// eslint-disable-next-line no-unused-vars
import { Request, Response } from 'express';

export interface IController {
    index: (req: Request, res: Response) => any;
    create: (req: Request, res: Response) => void;
    update: (req: Request, res: Response) => void;
    delete: (req: Request, res: Response) => void;
}
