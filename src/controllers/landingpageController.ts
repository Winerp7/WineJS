import { Request, Response } from 'express';

export const landingpage = (_req: Request, res: Response) => {
  res.render('landingpage', { title: 'Our dope ass app', path: '/' });
};