"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });

//import createError from 'http-errors';

const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const mongoose_1 = __importDefault(require("mongoose"));
const MongoStore = require('connect-mongo')(express_session_1.default);
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const connect_flash_1 = __importDefault(require("connect-flash"));
// Imports of our files
const errorHandlers = __importStar(require("./util/errorHandlers"));
const helpers = __importStar(require("./util/helpers"));
const routes_1 = require("./routes/routes");
// Init app
const app = express_1.default();
// View engine setup
app.set('views', path_1.default.join(__dirname, '../views'));
app.set('view engine', 'pug');
// Basic setup / middleware that just makes our lives easier.
// Mainly parsing that turns the raw request to usable properties e.g req.body or req.cookies
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(cookie_parser_1.default());
// Creating static path to public folder to make it easier to work with css files and images
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// TODO: Add prober error handler function in errorHandler.ts
if (!process.env.SECRET) {
    throw 'Missing environment secret! 🔥🔥';
}
// Sessions allow us to store data on visitors from request to request
// This keeps users logged in and allows us to send flash messages
app.use(express_session_1.default({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose_1.default.connection })
}));
// The flash middleware let's us use req.flash('error', 'Shit!'), which will then pass that message to the next page the user requests
app.use(connect_flash_1.default());
// pass variables to our templates + all requests
app.use((req, res, next) => {
    res.locals.helper = helpers;
    res.locals.flashes = req.flash();
    next();
});
// ----- All middleware goes *before* our routes -----
// Our routes
app.use('/', routes_1.router);
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
