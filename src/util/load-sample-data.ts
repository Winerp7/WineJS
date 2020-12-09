// @ts-nocheck
// uses no checks cuz it's not a part of the project
// and I just wanted it to work quickly so I made it the js way
require('dotenv').config({ path: 'variables.env' });
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

mongoose.connect(process.env.TEST_DB, {
  // settings to remove deprecation warnings
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(_con => {
  //console.log(con.connections);
  console.log('TestDB connection successful!');
})
  .catch(err => {
    console.log(err);
  });
mongoose.Promise = global.Promise; // Tell Mongoose to use ES6 promises

// import all of our models - they need to be imported only once
import { User } from "../models/userModel";
import { Node } from "../models/nodeModel";
import { Functionality } from "../models/functionalityModel";

// read all sample objects
const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../sample_data/users.json'), 'utf-8'));
const nodes = JSON.parse(fs.readFileSync(path.join(__dirname, '../../sample_data/nodes.json'), 'utf-8'));
const functionalities = JSON.parse(fs.readFileSync(path.join(__dirname, '../../sample_data/functionalities.json'), 'utf-8'));

async function deleteData() {
  console.log('😢😢 Goodbye Data...');
  await User.remove();
  await Node.remove();
  await Functionality.remove();
  console.log('Data Deleted. To load sample data, run\n\n\t npm run sample\n\n');
  process.exit();
}

async function loadData() {
  try {
    await User.insertMany(users);
    await Node.insertMany(nodes);
    await Functionality.insertMany(functionalities);
    console.log('👍👍👍👍👍👍👍👍 Done!');
    process.exit();
  } catch (e) {
    console.log('\n👎👎👎👎👎👎👎👎 Error! The Error info is below but if you are importing sample data make sure to drop the existing database first with.\n\n\t npm run nuke\n\n\n');
    console.log(e);
    process.exit();
  }
}

if (process.argv.includes('--delete')) {
  deleteData();
} else {
  loadData();
}
