import { Request, Response, NextFunction } from 'express';
import { Node} from "../models/nodeModel";
import { IUser } from '../models/userModel';

export const addNode = (req: Request, res: Response) => {
  req.flash('success', 'some shit'); // Maybe remove? 
  res.render('add-node', { title: 'Add Node', path: '/add-device' });
};

export const createNode = async (req: Request, res: Response) => {
  let user = req.user as IUser;

  req.body.owner = user._id;
  const node = await (new Node(req.body)).save();
  req.flash('success', `Successfully Created ${node.name}.`);
  // TODO This probably shouldn't redirect to landingpage? Maybe to 'view devices'-page instead
  res.redirect('/');
};

// Middleware function for fetching all nodes of a user and appending them to the body
export const fetchNodes = async (req: Request, _res: Response, next: NextFunction) => {
  const user = req.user as IUser;
  const nodes = await Node.find();

  // Only get the nodes that belong to the user
  req.nodes = nodes.filter(node => node.owner.equals(user._id));
  next();
};

export const getNodes = (req: Request, res: Response) => {
  res.render('nodes', { title: 'Your nodes', nodes: req.nodes });
};

// Finds a specific node based on its unique _id from mongoDB
export const editNode = async (req: Request, res: Response) => {
  const node = await Node.findOne({ _id: req.params.id });
  if (!node) {
    console.log('here should be a proper error 🙂');
  } else {
    res.render('add-node', { title: `Edit ${node.name}`, node: node });
  }
};

// Updates a node in the DB
export const updateNode = async (req: Request, res: Response) => {
  const node = await Node.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // returns the new node instead of the old one
    runValidators: true // runs the validators to ensure there is stil name etc.
  }).exec();

  if (!node) {
    // TODO: Add proper handling
    console.log("The node do not exist 🔥");
  } else {
    req.flash('success', `Successfully updated <strong>${node.name}</strong>. 
    <a href="/nodes/${node.slug}">View Node --> </a>`);
    res.redirect(`/nodes/${node._id}/edit`);
  }
};