import mongoose, { Document } from 'mongoose';
//mongoose.Promise = global.Promise; // test if this can be deletede and no false positives from mongo
import slug from 'slugify';

// Add the fns from mongoose document, so *this* has access to *isModified* fn
export interface INode extends Document {
  nodeID: string;
  name: string;
  isMaster: boolean;
  status: string;
  sensors: string[];
  slug: string;
}

const nodeSchema = new mongoose.Schema({
  nodeID: {
    type: String,
    required: 'A node must have an ID',
    unique: true
  },
  name: {
    type: String,
    required: 'A node must have a name',
    default: 'New Node',
    trim: true
  },
  isMaster: {
    type: Boolean
  },
  status: {
    type: String,
    default: 'Is this thing on?'
  },
  sensors: [String], // TODO: Change to type of sensors
  sensorData: [{
    timestamp: String,
    value: Number,
    sensorID: String
  }],
  slug: String,
});

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
