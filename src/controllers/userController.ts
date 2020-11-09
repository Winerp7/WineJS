import mongoose from 'mongoose';
import { Response, Request } from 'express';
const User = mongoose.model('User');
import { makeCanvasBar, makeCanvasLine, makeCanvasDoughnut } from '../util/canni';


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
  let graphs: Array<string> = [];

  graphs.push(await makeCanvasBar(
    'Temperature (Celsius)',
    [5, -2, 1, 0, 4, -1],
    ['Sensor 1', 'Sensor 3', 'Sensor 4', 'Sensor 7', 'Sensor 9', 'Sensor 10']
  ));
  graphs.push(await makeCanvasLine(
    'Sensor 5', 
    [100, 10.5, 35.2, 77.7, 101.20, 140.9],
    ['08:50', '09:00', '09:10', '09:20', '09:30', '09:40']
  ));
  graphs.push(await makeCanvasLine(
    'Sensor 11', 
    [78, 27, 82, 35, 40, 101],
    ['13:30', '13:40', '13:50', '14:00', '14:10', '14:20']
  ));
  graphs.push(await makeCanvasBar(
    'Temperature (Celsius)',
    [5, -2, 1, 0, 4, -1],
    ['Sensor 1', 'Sensor 3', 'Sensor 4', 'Sensor 7', 'Sensor 9', 'Sensor 10']
  ));
  graphs.push(await makeCanvasLine(
    'Sensor 11', 
    [78, 27, 82, 35, 40, 101],
    ['13:30', '13:40', '13:50', '14:00', '14:10', '14:20']
  ));
  graphs.push(await makeCanvasBar(
    'Temperature (Celsius)',
    [5, -2, 1, 0, 4, -1],
    ['Sensor 1', 'Sensor 3', 'Sensor 4', 'Sensor 7', 'Sensor 9', 'Sensor 10']
  ));
  // graphs.push(await makeCanvasDoughnut());

  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard', graphs: graphs});
};

export const directAddDevice = (_req: Request, res: Response) => {
  res.render('add-device', { pageTitle: 'Ads: Response Device', path: '/add-device' });
};

export const directSettings = (_req: Request, res: Response) => {
  res.render('settings', { pageTitle: 'Settings', path: '/settings', user: {name: 'Eminem', mail: 'eminem@sup.com'} });
};