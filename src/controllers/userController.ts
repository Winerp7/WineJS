import mongoose from 'mongoose';
import { Response, Request } from 'express';
const User = mongoose.model('User');
import { makeCanvas, draw } from '../util/canni';


export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      status: 'succes',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

export const directSignup = (_req: Request, res: Response) => {
  res.render('signup', { pageTitle: 'Sign up' });
};

export const directDashboard = async (_req: Request, res: Response) => {
  const Canvas = await makeCanvas();
  const Draw = await draw();

  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard', canvas: Canvas, draw: Draw });
};

export const directAddDevice = (_req: Request, res: Response) => {
  res.render('add-device', { pageTitle: 'Ads: Response Device', path: '/add-device' });
};

export const directSettings = (_req: Request, res: Response) => {
  res.render('settings', { pageTitle: 'Settings', path: '/settings' });
};