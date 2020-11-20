import { Response, Request, NextFunction } from 'express';
import passport from "passport";
import { User } from "../models/userModel";
import crypto from "crypto";
import * as mail from "../util/mail";



export const login = passport.authenticate('local', {
  failureRedirect: '/', // TODO: make such that the login modal is open when redirecting back
  failureFlash: 'reset it.',
  successRedirect: '/dashboard',
  successFlash: 'Well done! You are now logged in 👏👏 '
});

export const logout = (req: Request, res: Response) => {
  req.logout();
  req.flash('success', 'You are now logged out 👋');
  res.redirect('/');
};

// middleware to protect routes, checks if they are logged in before visiting a page
export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next(); // they are logged in! Feel free to proceed 🙂
    return;
  }
  req.flash('error', 'Woopsi, access denied. You must be logged in to do that ⛔');
  res.redirect('/'); //TODO: maybe add so the login modal is open upon redirect
};

// Handle the reset password form and send email with reset link
export const forgotPassword = async (req: Request, res: Response) => {
  // See if user with that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    // We are aware that this is bad practice because
    // you could keep entering emails to see which emails is registered in our system.
    // Early stage it's more helpful for the user to be informed that they entered a wrong email
    req.flash('error', 'Sorry but no account with that email exists 🙇‍♂️');
    return res.redirect('/');
  }

  // Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await user.save();

  console.log("Getting here 1");
  // Create link with the token
  const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
  mail.send({
    user,
    subject: 'Password Reset',
    resetURL,
    filename: 'password-reset'
  });

  console.log("Getting here 1");
  req.flash('success', 'You have been emailed a password reset link - the link is active for 1 hour. NB: It is probably in your spam folder 🙂');
  res.redirect('/'); //  Redirect to login page
};

// Validate the user entered the correct password in both:
// Password and confirm-password field
export const confirmResetPassword = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.passwordReset === req.body.passwordResetConfirm) {
    next(); // Keep it going! 🏃‍♂️🏃‍♂️🏃‍♂️
    return;
  }
  req.flash('error', 'Sorry buddy - but the passwords do not match!');
  res.redirect('back');
};

// Updates the password in the DB to the password entered in the reset form
export const updateResetPassword = async (req: Request, res: Response) => {
  let user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Password reset token is invalid or has expired');
    return res.redirect('/');
  }

  await user.setPassword(req.body.passwordReset);
  user.resetPasswordToken = undefined; // Deletes the token from DB
  user.resetPasswordExpires = undefined; // Deletes the expire time from DB
  const updatedUser = await user.save();
  req.login(updatedUser, function (err) {
    if (err) {
      console.log("Failed to login after reset password, error: ", err);
      req.flash('error', 'Sorry, we failed to log you in after resetting your password - please try again 🤷‍♂️');
      return res.redirect('/');
    }
    req.flash('success', '💃 Wuhu! Your password has been reset! You are now logged in!');
    return res.redirect('/');
  });

};