import mongoose, { Document, PassportLocalSchema } from 'mongoose';
mongoose.Promise = global.Promise; // test if this can be deletede and no false positives from mongo
//import md5 from 'md5';
import validator from 'validator';
import passportLocalMongoose from 'passport-local-mongoose';
const mongodbErrorHandler: any = require('mongoose-mongodb-errors');

// Add the fns from mongoose document, so *this* has access to *isModified* fn
export interface IUser extends Document {
  name: string;
  email: string;
  //password: string;
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
  // password: {
  //   type: String,
  //   required: 'Please enter a password'
  // }
});

// for shitz and gigglez
// has to use function() otherwise this is not bound to user
userSchema.virtual('gravatar').get(function (this: IUser) {
  // Frede pretty boooi
  return `https://scontent.faal2-1.fna.fbcdn.net/v/t1.0-9/10923545_10206317810131138_2378949127523440736_n.jpg?_nc_cat=111&ccb=2&_nc_sid=174925&_nc_ohc=z7q_rrKb8-QAX-M7g3a&_nc_ht=scontent.faal2-1.fna&oh=9983f36cd25ad42e6cb3a71c52809217&oe=5FCC8E54`;

  // Bent AAU pic
  //return `https://mail.aau.dk/owa/service.svc/s/GetPersonaPhoto?email=bt%40cs.aau.dk&UA=0&size=HR96x96`;

  // TODO: Delete if nobody has any good pics on their gravatar
  // const hash = md5(this.email);
  // return `https://gravatar.com/avatar/${hash}?s=200`;
});

// exposes some low level functions e.g. User.register to register a user
userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
// gives prettier / more useful errors than mongo normally do
userSchema.plugin(mongodbErrorHandler);

// Users is the table that it should use/create in the DB
const User = mongoose.model<IUser>('Users', userSchema as PassportLocalSchema);

export { User };