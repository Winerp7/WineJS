const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugify');

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
  status: {
    type: String,
    default: 'Is this thing on?'
  },
  slug: String,
  sensors: [String]
});

nodeSchema.pre('save', function(next){
  if (!this.isModified('name')) {
    return next();
  }
  this.slug = slug(this.name);
  next();
  // TODO: make so slugs are unique
});

module.exports = mongoose.model('NodeDevice', nodeSchema);