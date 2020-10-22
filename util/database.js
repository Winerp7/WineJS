const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db; 

// Establish connection to mongoDB
const mongoConnect = callback => {
  MongoClient.connect(
    `${process.env.MONGO_CONNECTION_STRING}`
  )
    .then(client => {
      console.log('Successfully connected to MongoDB');
      _db = client.db();
      callback();
    })
    .catch(err => {
    console.log(err);
    throw err;
    });  
}

// get DB connection if already established
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
