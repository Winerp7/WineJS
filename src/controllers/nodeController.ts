import { Request, Response, NextFunction } from 'express';
import { Node} from "../models/nodeModel";
import { IUser } from '../models/userModel';
import { Stream } from 'stream';

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
  res.render('nodes', { title: 'Your nodes', nodes: req.nodes, funcs: req.functionalities});
};

// Finds a specific node based on its unique _id from mongoDB
export const editNode = async (req: Request, res: Response) => {
  const node = await Node.findOne({ _id: req.params.id });

  if (!node) {
    console.log('here should be a proper error 🙂');
  } else {
    res.render('edit-device', { title: `Edit ${node.name}`, node: node, funcs: req.functionalities});
  }
};

// Updates a node in the DB
export const updateNode = async (req: Request, res: Response) => {

  if (req.body.function) {
    const temp = req.functionalities?.filter(functionality => functionality.name === req.body.function); 
    if (temp && temp.length > 0)
      req.body.function = req.functionalities?.filter(functionality => functionality.name === req.body.function)[0].id;
    else 
      req.body.function = null; 
  } 

  // Check if we add a new functionality and set status to 'pending'
  const myNode = await Node.findById(req.params.id); 
  if (myNode && (((myNode.function === null && req.body.function != null)) || (myNode.function != null && !(myNode.function.equals(req.body.function))))) {
    req.body.updateStatus = 'Pending'; 
  }

  const node = await Node.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true, // returns the new node instead of the old one
    runValidators: true // runs the validators to ensure there is stil name etc.
  }).exec();

  if (!node) {
    // TODO: Add proper handling
    console.log("The node does not exist 🔥");
  } else {
    req.flash('success', `Successfully updated ${node.name}! 🔥`);
    res.redirect(`/nodes`);
  }
};

export const downloadData = async (req: Request, res: Response) => {
  var nodeData = req.nodes?.filter(node => node.nodeID === req.params.nodeID);
  var fileContents = Buffer.from(JSON.stringify(nodeData), "ascii");
  var readStream = new Stream.PassThrough();
  readStream.end(fileContents);
  res.set('Content-disposition', 'attachment; filename=' + "SensorData.json");
  readStream.pipe(res);
};

export const downloadImage = async (req: Request, res: Response) => {
  if (req.body.namemaster && req.body.passwordmaster) {
    res.download("images/master.img");
  } else if (req.body.nameslave && req.body.passwordslave) {
    res.download("images/slave.img");
  }
}
