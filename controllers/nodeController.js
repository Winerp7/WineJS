const mongoose = require('mongoose');
const Node = mongoose.model('NodeDevice');

exports.addNode = (req, res) => {
  req.flash('success', 'some shit');
  res.render('edit-node', {title: 'Add Node', path: '/add-device'});
};

exports.createNode = async (req, res) => {
  //const node = new Node(req.body);
  //await node.save();
  const node = await (new Node(req.body)).save();
  req.flash('success', `Successfully Created ${node.name}.`);
  res.redirect('/');
};

exports.fetchNodes = async (req, res, next) => {
  req.nodes = await Node.find();
  next();
};

exports.getNodes = async (req, res) => {
  res.render('nodes', {title: 'Your nodes', nodes: req.nodes, path: '/nodes'});
};

exports.editNode = async (req, res) => {
  const node = await Node.findOne({_id: req.params.id});
  res.render('edit-node', {title: `Edit ${node.name}`, node: node});
}

exports.updateNode = async (req, res) => {
  const node = await Node.findOneAndUpdate({_id: req.params.id}, req.body, {
    new: true, // retuns the new node instead of the old one
    runValidators: true // runs the validators to ensure there is stil name etc.
  }).exec();
  req.flash('success', `Successfully updated <strong>${node.name}</strong>. 
  <a href="/nodes/${node.slug}">View Node --> </a>`);
  res.redirect(`/nodes/${node._id}/edit`);
};