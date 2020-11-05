import { Request, Response, NextFunction } from 'express';

export const landingpage = (req: Request, res: Response, next: NextFunction) => {
  res.render('landingpage', { title: 'Our dope ass app', path: '/' });
};