import mongoose, { Document } from 'mongoose';
//mongoose.Promise = global.Promise; // test if this can be deletede and no false positives from mongo
import slug from 'slugify';

// Add the fns from mongoose document, so *this* has access to *isModified* fn
export interface INode extends Document {
  [x: string]: any;
  nodeID: string;
  name: string;
  isMaster: boolean;
  status: string;
  sensors: string[];
  sensorData: { timestamp: string, value: number, sensorID: string }[];
  function: string;
  slug: string;
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
    timestamp: String,
    value: Number,
    sensorID: String
  }],
  function: String,
  slug: String,
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: 'You must supply a user'
  }
});

nodeSchema.statics.findSensorDataByNodeID = function (sensorID: string) {
  return this.aggregate([
    { $unwind: '$sensorData' },
    { $match: { "sensorData.sensorID": sensorID } },
    { $project: { sensorData: 0 } } // Remove everything but the functionality object
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
