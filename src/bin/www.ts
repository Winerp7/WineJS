#!/usr/bin/env node

import mongoose from 'mongoose';

// import environment variables from our variables.env file
require('dotenv').config({ path: 'variables.env' });

let dbConnectionString: string; 

// TODO: Add prober error handler function in errorHandler.ts
if (process.env.NODE_ENV == 'test' && process.env.TEST_DB) {
  dbConnectionString = process.env.TEST_DB;
  console.log("connecting to the test database");
} else if (process.env.NODE_ENV == 'development' && process.env.MONGO_CONNECTION_STRING) {
  dbConnectionString = process.env.MONGO_CONNECTION_STRING;
  console.log("connecting to the development database");
} else {
  throw 'Missing environment Mongo connection string! 🔥🔥';
}



// Connect to database and handle bad connections
mongoose.connect(dbConnectionString, {
  // settings to remove deprecation warnings
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(_con => {
  //console.log(con.connections);
  console.log('DB connection successful!👍');
})
  .catch(err => {
    console.log(err);
  });
mongoose.Promise = global.Promise; // lets mongoose use ES6 promises

// import all of our models
import '../models/userModel';
import '../models/nodeModel';

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('winejs:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: any; }) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
