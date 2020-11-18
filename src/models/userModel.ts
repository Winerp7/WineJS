import mongoose, { Document, PassportLocalSchema, PassportLocalDocument } from 'mongoose';
mongoose.Promise = global.Promise; // test if this can be deletede and no false positives from mongo
import md5 from 'md5';
import validator from 'validator';
import passportLocalMongoose from 'passport-local-mongoose';
const mongodbErrorHandler: any = require('mongoose-mongodb-errors');

// Add the fns from mongoose document, so *this* has access to *isModified* fn
export interface IUser extends PassportLocalDocument{
  name: string;
  email: string;
  functionality: { _id: string, name: string, setup: string, loop: string, description: string, restart: boolean; }[];
  filter: string[];
  resetPasswordToken: string | undefined; // TODO: maybe find a better solution than undefined. Used in authController
  resetPasswordExpires: Date | number | undefined; // TODO: maybe find a better solution than undefined. Used in authController
  //password: string;
  //changePassword (oldPassword: string, newPassword: string): Promise<PassportLocalDocument>
  //setPassword(password: string): Promise<PassportLocalDocument>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'Please enter a name',
    trim: true
  },
  email: {
    type: String,
    required: 'Please supply an email address',
    unique: true,
    lowercase: true, // Makes it easier to compare two emails if they are all lowercase
    trim: true, // Remove all white space in either end e.g. '   bent@gmail.com      '
    validate: [validator.isEmail, 'Invalid Email Address'], // Checks that email has @ and other requirements for being an email
  },
  functionality: [{
    name: String,
    setup: String,
    loop: String,
    description: String,
    restart: Boolean
  }],
  filter: {
    type: [String],
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  password: {
    type: String,
  }
});

// for shitz and gigglez
// has to use function() otherwise this is not bound to user
userSchema.virtual('gravatar').get(function (this: IUser) {

  // TODO: create gravatar profiles with fake emails for demo purposes?
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

// exposes some low level functions e.g. User.register to register a user
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// gives prettier / more useful errors than mongo normally do
userSchema.plugin(mongodbErrorHandler);

// Users is the table that it should use/create in the DB
const User = mongoose.model<IUser>('Users', userSchema as PassportLocalSchema);

export { User };