import { Response, Request, NextFunction } from 'express';
import { IUser, User } from "../models/userModel";
import { makeCanvasLine } from '../util/canni';
import { promisify } from 'es6-promisify';
import { ensure } from './piController';

export const directFunctionality = async (req: Request, res: Response) => {
  let user = req.user as IUser;

  res.render('functionality', {pageTitle: 'Functionality', path: '/functionality', funcs: user.functionality, nodes: req.nodes}); 
}

export const directDashboard = async (req: Request, res: Response) => {
  let graphs: string[] = [];

  // Generate graphs
  // TODO Should be based on the user's filters & should graph sensors, not nodes.
  if (req.nodes) {
    // async/await doesn't seem to work with forEach =(
    for (let index: number = 0; index < req.nodes.length; index++) {
      graphs.push(await makeCanvasLine(
        req.nodes[index].name,
        ['Sensor 1', 'Sensor 3', 'Sensor 4', 'Sensor 7', 'Sensor 9', 'Sensor 10'],
        [5, -2, 1, 0, 4, -1],
      ));
    }
  }
  let user = req.user as IUser;
  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard', graphs: graphs, nodes: req.nodes, filter: user.filter });
};

export const updateFilters = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new Error("this is bad");
  }
  let user = req.user as IUser;

  let newFilter: string[] = [];

  for (var key in req.body)
    if (req.body.hasOwnProperty(key))
      newFilter.push(key);

  const updates = {
    filter: newFilter
  };

  await User.findOneAndUpdate(
    { _id: user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated filters! 🥳');
  res.redirect('back');
};

export const addFunctionality = async (req: Request, res: Response) => {
  if (!req.user) {
    throw new Error("this is bad");
  }
  let user = req.user as IUser;
  let func = ensure(user.functionality.find(func => func._id == "1"));

  const updates = {
  
  }; 

  await User.findOneAndUpdate(
    { _id: user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated functionality available for your nodes! 🥳');
  res.redirect('back');
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