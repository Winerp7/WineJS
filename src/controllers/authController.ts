import { Response, Request, NextFunction } from 'express';
import passport from "passport";

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