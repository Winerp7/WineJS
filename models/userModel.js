const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A user must have a name'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'A user must have a password']
  }
});

module.exports = mongoose.model('User', userSchema);