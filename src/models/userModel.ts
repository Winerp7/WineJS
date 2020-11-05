import mongoose from 'mongoose';


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

export default mongoose.model('User', userSchema);