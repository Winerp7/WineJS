import { Response, Request, NextFunction } from 'express';
import { IUser, User } from "../models/userModel";
import { makeCanvasBar, makeCanvasLine } from '../util/canni';
import { promisify } from 'es6-promisify';


export const directDashboard = async (req: Request, res: Response) => {
  let graphs: Array<string> = [];

  graphs.push(await makeCanvasBar(
    'Temperature (Celsius)',
    ['Sensor 1', 'Sensor 3', 'Sensor 4', 'Sensor 7', 'Sensor 9', 'Sensor 10'],
    [5, -2, 1, 0, 4, -1],
  ));
  graphs.push(await makeCanvasLine(
    'Sensor 5', 
    ['08:50', '09:00', '09:10', '09:20', '09:30', '09:40'],
    [100, 10.5, 35.2, 77.7, 101.20, 140.9],
  ));
  graphs.push(await makeCanvasLine(
    'Sensor 11', 
    ['13:30', '13:40', '13:50', '14:00', '14:10', '14:20'],
    [78, 27, 82, 35, 40, 101],
  ));
  // graphs.push(await makeCanvasDoughnut());

  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard', graphs: graphs, nodes: req.nodes });
};

export const settings = (_req: Request, res: Response) => {
  res.render('settings', { pageTitle: 'Settings', path: '/settings' });
};

export const updateSettings = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new Error("this is bad");
  }
  let user = req.user as IUser;

  const updates = {
    name: req.body.name || user.name,
    email: req.body.newEmail || user.email,
    password: 'sabj17' // TODO: remember to do some validation on pw1 og pw2
    // TODO: Fix password, can't get user.password because it is a hash 
  };

  //const user = req.user as IUser;
  await User.findOneAndUpdate(
    { _id: user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated profile! 🥳');
  res.redirect('back');
};

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name 🙂').notEmpty();
  req.checkBody('email', 'That Email is not valid 📧').isEmail();
  /* 
  Normalizing handles different variations of the "same" email, examples that google allows:
  Test@gmail.com
  TEST@gmail.com
  test@googlemail.com
  t.e.s.t@gmail.com
  test+123@gmail.com
  
  Normalized result: test@gmail.com
  */
  req.sanitizeBody('email').normalizeEmail({
    gmail_remove_dots: false
  });
  req.checkBody('password', 'Password Cannot be Blank').notEmpty();
  req.checkBody('password-confirm', 'Confirmed Password Cannot be Blank').notEmpty();
  req.checkBody('password-confirm', 'Woops! Your password do not match').equals(req.body.password);

  // Will contain an array of the errors from all the above sanitization
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map((err: any) => err.msg));
    // TODO: use req.body to populate the modal again, so the user don't have to refill the fields
    res.render('landingpage', { title: 'Register', body: req.body, flashes: req.flash(), showModal: 'flex' });
    return; // stop the fn from running
  }
  next(); // there were no errors
};

export const register = async (req: Request, _res: Response, next: NextFunction) => {
  const user = new User({ name: req.body.name, email: req.body.email });
  const register = promisify(User.register.bind(User));
  await register(user, req.body.password);
  next(); // pass to authController.login
};