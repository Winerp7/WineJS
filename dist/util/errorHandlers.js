"use strict";
/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch and errors they throw, and pass it along to our express middleware with next()
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionErrors = exports.developmentErrors = exports.flashValidationErrors = exports.notFound = exports.catchErrors = void 0;
// TODO: Fix all any's to proper types
exports.catchErrors = (fn) => {
    return function (req, res, next) {
        return fn(req, res, next).catch(next);
    };
};
/*
  Not Found Error Handler

  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (_req, _res, next) => {
    const err = new Error('Not Found');
    // TODO: Fix so err. can have a status 404
    //err.status = 404;
    next(err);
};
/*
  MongoDB Validation Error Handler

  Detect if there are mongodb validation errors that we can nicely show via flash messages
*/
exports.flashValidationErrors = (err, req, res, next) => {
    if (!err.errors)
        return next(err);
    // validation errors look like
    const errorKeys = Object.keys(err.errors);
    errorKeys.forEach(key => req.flash('error', err.errors[key].message));
    res.redirect('back');
};
/*
  Development Error Hanlder

  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, _req, res, _next) => {
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
        },
        'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
    });
};
/*
  Production Error Hanlder

  No stacktraces are leaked to user
*/
exports.productionErrors = (err, _req, res, _next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
};
