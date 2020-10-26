const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');


// Imports of our files
const errorHandlers = require('./util/errorHandlers');

const helpers = require('./util/helpers');
const indexRouter = require('./routes/index');


// Init app
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Basic setup / middleware that just makes our lives easier.
// Mainly parsing that turns the raw request to usable properties e.g req.body or req.cookies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// Creating static path to public folder to make it easier to work with css files and images
app.use(express.static(path.join(__dirname, 'public')));

// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.helper = helpers;
  res.locals.flashes = req.flash();
  next();
});

// ----- All middleware goes *before* our routes -----

// Our routes
app.use('/', indexRouter);

// ----- Error handling if non of our routes handles the request -----

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// One of our error handlers will see if these errors are just validation errors
app.use(errorHandlers.flashValidationErrors);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);





//* DEFAULT ERROR HANDLiNG. STILL FIGURING OUT IF I LIKE THE NEW BETTER *//

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });


// We export it so we can start the site in /bin/www
module.exports = app;
