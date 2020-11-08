import mongoose from 'mongoose';
import { Response, Request } from 'express';
const User = mongoose.model('User');
import { makeCanvasBar, makeCanvasLine, makeCanvasDoughnut, draw } from '../util/canni';


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
  const CanvasBar = await makeCanvasBar();
  const CanvasLine = await makeCanvasLine(
    'Sensor 5', 
    [100, 10.5, 35.2, 77.7, 101.20, 140.9],
    ['08:50', '09:00', '09:10', '09:20', '09:30', '09:40']
  );
  const CanvasDoughnut = await makeCanvasDoughnut();
  // const Draw = await draw();

  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard', graphs: [CanvasBar, CanvasLine, CanvasDoughnut]});
};

export const directAddDevice = (_req: Request, res: Response) => {
  res.render('add-device', { pageTitle: 'Ads: Response Device', path: '/add-device' });
};

export const directSettings = (_req: Request, res: Response) => {
  res.render('settings', { pageTitle: 'Settings', path: '/settings', user: {name: 'Eminem', mail: 'eminem@sup.com'} });
};