//import createError from 'http-errors';
import express from 'express';
import session from 'express-session';
import expressValidator from 'express-validator';
import mongoose from 'mongoose';
const MongoStore = require('connect-mongo')(session);
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import flash from 'connect-flash';
import passport from 'passport';
import { promisify } from 'es6-promisify';


// Imports of our files
import * as errorHandlers from './util/errorHandlers';
import * as helpers from './util/helpers';
import { router } from './routes/routes';
import './util/passport'; // invokes the code in passport.ts


// Init app
const app = express();

// View engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

// Creating static path to public folder to make it easier to work with css files and images
app.use(express.static(path.join(__dirname, '../public')));

// Basic setup / middleware that just makes our lives easier.
// Mainly parsing that turns the raw request to usable properties e.g req.body or req.cookies
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Exposes a bunch of methods for validating data. Used heavily on userController.validateRegister
app.use(expressValidator());
// populates req.cookies with any cookies that came along with the request
app.use(cookieParser());

if(!process.env.SECRET){
  throw 'Missing environment SECRET! 🔥🔥';
}


// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

// Initilize passport which we use for login and authentication
app.use(passport.initialize());
app.use(passport.session());

// The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(flash());

// pass variables to our templates + all requests
app.use((req, res, next) => {
  res.locals.helper = helpers;
  res.locals.flashes = req.flash();
  res.locals.user = req.user || null;
  res.locals.currentPath = req.path;
  next();
});

// promisify some callback based APIs
app.use((req, _res, next) => {
  req.login = promisify(req.login.bind(req));
  next();
});

// ----- All middleware goes *before* our routes -----

// Our routes
app.use('/', router);

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

// We export it so we can start the site in /bin/www
module.exports = app;
