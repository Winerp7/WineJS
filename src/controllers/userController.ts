import { Response, Request, NextFunction } from 'express';
import { IUser, User } from "../models/userModel";
import { makeLine} from '../util/canni';
import { promisify } from 'es6-promisify';
import { INode, Node } from "../models/nodeModel";

export const directResetPassword = async (_req: Request, res: Response) => {
  res.render('reset-password', { path: '/reset-password' });
};

// TODO Fix text on server
export const directDashboard = async (req: Request, res: Response) => {
  let user = req.user as IUser;
  let filter: string[] = []; // All sensor names to be in the filters
  let graphs: string[] = [];

  if (req.nodes != null) {
    // Iterate through the user's nodes
    for (let nodeIndex: number = 0; nodeIndex < req.nodes.length; nodeIndex++) {
      // Iterate through the current node's sensors
      let nodeName: string = req.nodes[nodeIndex].name;
      for (let sensorIndex: number = 0; sensorIndex < req.nodes[nodeIndex].sensors.length; sensorIndex++) {
        let sensorName: string = req.nodes[nodeIndex].sensors[sensorIndex];
        let filterElement: string = nodeName + ": " + sensorName;
        filter.push(filterElement);

        // If the user has selected the sensor with 'id' in their filter
        if (user.filter.includes(filterElement)) {
          let timestamps: string[] = [];  // Holds all timestamps from the sensor
          let values: number[] = [];      // Holds all values from the sensor
          // @ts-ignore
          const sensorDataList = await Node.findSensorDataBySensorID(req.nodes[nodeIndex].nodeID, sensorName, user) as INode;
          // Retrieve values and timestamps from sensorData
          for (let dataIndex: number = 0; dataIndex < sensorDataList.length ; dataIndex++) {
            // Remove date and decimals for better readability
            let timestamp: string = sensorDataList[dataIndex].sensorData.timestamp;
            timestamp = timestamp.split(/T|\./)[1]; // Index0=date, Index1=time, Index2=second decimals
            timestamps.push(timestamp);
            values.push(sensorDataList[dataIndex].sensorData.value);
          }

          // Generate the graph for the sensor
          graphs.push(await makeLine(
            filterElement,
            timestamps,
            values,
          ));
        }
      }
    }
  }
  res.render('dashboard', { pageTitle: 'Dashboard', path: '/dashboard', graphs: graphs, nodes: req.nodes, filter: filter, userFilter: user.filter, funcs: req.functionalities });
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

// ! This is a test to see if we can get functions without making it it's own document

export const getOneFunctions = async (req: Request, res: Response) => {
  // @ts-ignore
  const fns = await User.findOneFunctionality('sut min roev', req.user as IUser);
  res.json(fns);
};

export const getAllFunctions = async (req: Request, res: Response) => {
  // @ts-ignore
  const fns = await User.findAllFunctionality(req.user as IUser);
  res.json(fns);
};

// ! **********************************************************************************

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

const updateName = async (req: Request, res: Response, user: IUser) => {
  await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { name: req.body.name } },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated the profile!');
  return res.redirect('back');
};

// Check if a user with that email already exist if not then change it
const updateEmail = async (req: Request, res: Response, user: IUser) => {
  const foundUser = await User.findOne({ email: req.body.newEmail });
  if (foundUser) {
    req.flash('error', 'A user already has that delightful email ⛔');
    return res.redirect('/settings');
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { email: req.body.newEmail } },
    { new: true, runValidators: true, context: 'query' }
  );

  // No updates has been made for email
  // But it should since it passed validation
  if (!updatedUser) {
    req.flash('error', 'Sorry could not find your user in the databse');
    res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }

  // if you change the email relogin the user and avoid the auto logout
  req.login(updatedUser, function (err) {
    if (err) {
      req.flash('error', 'Something went wrong when signing you in with your new email');
      res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
      return;
    } else {
      req.flash('success', 'Updated the profile!');
      return res.redirect('back');
    }
  });
};

// Checks if a user exist with their email, if yes then change the password
const updatePassword = async (req: Request, res: Response, user: IUser) => {
  const foundUser = await User.findOne({ email: user.email });
  if (!foundUser) {
    req.flash('error', 'Cannot find a user with your email, please try changing your password again later');
    res.render('settings', { title: 'Settings', body: req.body, flashes: req.flash() });
    return; // stop the fn from running
  }
  foundUser.changePassword(req.body.password, req.body.newPasswordOne, function (err) {
    if (err) {
      if (err.name === 'IncorrectPasswordError') {
        req.flash('error', 'Sorry you entered an incorrect password ⛔');
        return res.redirect('/settings');
      } else {
        req.flash('error', 'Sorry something went wrong ⛔');
        return res.redirect('/settings');
      }
    } else {
      req.flash('success', 'Updated the profile!');
      return res.redirect('back');
    }
  });

};

export const updateSettings = async (req: Request, res: Response) => {
  let user = req.user as IUser;

  if (req.path === '/settings/name') {
    updateName(req, res, user);
  }

  if (req.path === '/settings/email') {
    updateEmail(req, res, user);
  }

  if (req.path === '/settings/password') {
    updatePassword(req, res, user);
  }
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
