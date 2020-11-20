import { Response, Request, NextFunction } from 'express';
import { IUser, User } from "../models/userModel";
import { makeCanvasLine } from '../util/canni';
import { promisify } from 'es6-promisify';

export const directFunctionality = async (req: Request, res: Response) => {
  let user = req.user as IUser;

  res.render('functionality', {pageTitle: 'Functionality', path: '/functionality', funcs: user.functionality}); 
}; 

export const addFunctionality = async (_req: Request, res: Response) => {
  res.render('add-functionality', {pageTitle: 'Add functionality', path: '/add-functionality'}); 
}; 

export const editFunctionality = async (_req: Request, res: Response) => {
  // TODO implement such that this renders add functionality and sends the specific func with it

  res.render('add-functionality', {pageTitle: "Edit functionality", path: '/add-functionality'}); 
}

export const directResetPassword = async (_req: Request, res: Response) => {
  res.render('reset-password', {path: '/reset-password'})
};

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
  // TODO proper error handling (either redirect back or success + flash message)
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

export const settings = (_req: Request, res: Response) => {
  res.render('settings', { pageTitle: 'Settings', path: '/settings' });
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
    return;
  }
  next(); // there were no errors, going next to register 🚶‍♂️🚶‍♂️
};

export const register = async (req: Request, _res: Response, next: NextFunction) => {
  const user = new User({ name: req.body.name, email: req.body.email });
  const register = promisify(User.register.bind(User));
  await register(user, req.body.password);
  next(); // pass to authController.login
};

// TODO: make a validator.ts file to clean up this function.
// TODO: each setting could have been its own midleware but that would result in a lot of boilerplate
export const updateSettings = async (req: Request, res: Response) => {
  const updates = {};

  // Type guard that ensures a user is logged in
  if (!req.user) {
    req.flash('error', 'Sorry an error occured - you seemed to not be logged in');
    res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
    return;
  }
  let user = req.user as IUser;

  if (req.path === '/settings/name') {
    req.checkBody('name', 'Do you not have a name? 🙂').notEmpty();
  }

  if (req.path === '/settings/email') {
    req.checkBody('email', 'You must supply an email 💌 ').notEmpty().isEmail().equals(user.email);
    req.checkBody('newEmail', 'You must supply a new email 💌 ').notEmpty().isEmail();
    req.sanitizeBody('newEmail').normalizeEmail({
      gmail_remove_dots: false
    });
  }

  if (req.path === '/settings/password') {
    req.checkBody('password', 'Password Cannot be Blank').notEmpty();
    req.checkBody('newPasswordOne', 'Confirmed Password Cannot be Blank').notEmpty();
    req.checkBody('newPasswordTwo', 'Confirmed Password Cannot be Blank').notEmpty();
    req.checkBody('newPasswordOne', 'Woops! Your password do not match').equals(req.body.newPasswordTwo);
  }

  // Will contain an array of the errors from all the above sanitization
  const errors = req.validationErrors();
  if (errors) {
    req.flash('error', errors.map((err: any) => err.msg));
    res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }

  // Checks if a user exist with their email, if yes then change the password
  if (req.path === '/settings/password') {
    const foundUser = await User.findOne({ email: user.email });
    if (!foundUser) {
      req.flash('error', 'Cannot find a user with your email, please try changing your password again later');
      res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
      return; // stop the fn from running
    }
    await foundUser.changePassword(req.body.password, req.body.newPasswordOne);
  }

  // Checks if the email already exists in the DB
  if (req.path === '/settings/email') {
    const foundUser = await User.findOne({ email: req.body.newEmail });
    if (foundUser) {
      console.log('*********************************************');
      req.flash('error', 'A user already has that delightful email ⛔');
      return res.redirect('/settings');
    }
  }

  // Adds name or email to the *updates* object
  req.body.name && Object.assign(updates, { name: req.body.name });
  req.body.newEmail && Object.assign(updates, { email: req.body.newEmail });

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );

  // No updates has been made for either name or email
  // But it should since it passed validation
  if (!updatedUser) {
    req.flash('error', 'Sorry could not find your user in the databse');
    res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }

  // if you change the email relogin the user and avoid the auto logout
  req.login(updatedUser, function (err) {
    if (err) {
      console.log("🍿🍿🍿🍿🍿🍿🍿🍿🍿🍿", err);
      req.flash('error', 'Something went wrong when signing you in with your new email');
      res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
      return;
    } else {
      req.flash('success', 'Updated the profile!');
      return res.redirect('back');
    }
  });
};

export const deleteAccount = async (req: Request, res: Response) => {
  const user = req.user as IUser;

  await User.deleteOne({ email: user.email }, function (err) {
    if (err) {
      req.flash('error', 'Sorry something went wrong when trying to delete your account');
      res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
      return;
    };
    req.flash('success', 'You account is now deleted! 👋👋👋');
    return res.redirect('/');
  });
};

// If token is valid direct the user to the *reset PW* form
export const resetPassword = async (req: Request, res: Response) => {
  // Checks if a user exists with the token from the URL and that it is not expired
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired');
    return res.redirect('/');
  }
  res.render('reset-password', { title: 'Reset your Password' });
};