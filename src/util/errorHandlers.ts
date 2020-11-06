/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/

import { NextFunction, Request, Response } from 'express';

// TODO: Fix all any's to proper types

export const catchErrors = (fn: any) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
  const err = new Error('Not Found');
  // TODO: Fix so err. can have a status 404
  //err.status = 404;
  next(err);
};

/*
  MongoDB Validation Error Handler

  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/
export const flashValidationErrors = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (!err.errors) return next(err);
  // validation errors look like
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => req.flash('error', err.errors[key].message));
  res.redirect('back');
};


/*
  Development Error Hanlder

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
export const developmentErrors = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      res.render('error', errorDetails);
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
  });
};


/*
  Production Error Hanlder

  No stacktraces are leaked to user
*/
export const productionErrors = (err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
};
