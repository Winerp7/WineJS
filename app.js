const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv').config()

// Imports of our files
const indexRouter = require('./routes/landingpage');
const userRouter = require('./routes/user');

const mongoConnect = require('./util/database').mongoConnect;


// Connect to database
mongoConnect(() => {
  app.listen(5000);
});

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

// ----- All middleware goes *before* our routes -----


// Our routes
app.use('/user', userRouter);
app.use('/', indexRouter);

// ----- Error handling if non of our routes handles the request -----

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
