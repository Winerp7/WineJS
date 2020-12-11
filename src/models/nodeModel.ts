import mongoose, { Document } from 'mongoose';
//mongoose.Promise = global.Promise; // test if this can be deletede and no false positives from mongo
import slug from 'slugify';
import { IUser } from './userModel';

// Add the fns from mongoose document, so *this* has access to *isModified* fn
export interface INode extends Document {
  [x: string]: any;
  nodeID: string;
  name: string;
  isMaster: boolean;
  status: string;
  sensors: string[]; //TODO: REMOVE
  sensorData: {time: string, value: number, sensor: string}[]
  updateStatus: string; 
  function: mongoose.Types.ObjectId;
  slug: string;
  owner: mongoose.Types.ObjectId; 
}

const nodeSchema = new mongoose.Schema({
  nodeID: {
    type: String,
    unique: true
  },
  name: {
    type: String,
    default: 'New Node',
    trim: true
  },
  isMaster: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    default: 'Is this thing on?'
  },
  updateStatus: {
    type: String,
    default: 'Updated'
  },
  sensors: [String], // TODO: Change to type of sensors
  sensorData: [{
    time: String,
    value: Number,
    sensor: String
  }],
  function: { 
    type: mongoose.Types.ObjectId,
    default: null
  },
  slug: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: 'You must supply a user'
  }
});

nodeSchema.statics.findSensorDataBySensorID = function (nodeID: string, sensor: string, user: IUser) {
  return this.aggregate([
    { $match: { "owner": user._id } },
    { $match: { "nodeID": nodeID } },
    { $unwind: '$sensorData' },
    { $match: { "sensorData.sensor": sensor } },
    { $project: { _id: false, "sensorData": 1 } } // Remove everything but the sensorData object
  ]);
};

nodeSchema.pre('save', function (this: INode, next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  next();
  // TODO: make so slugs are unique
});

// NodeDevice is the table that it should use/create in the DB
const Node = mongoose.model<INode>('NodeDevice', nodeSchema);

export { Node };
