import { Request, Response } from 'express';
import { INode, Node } from "../models/nodeModel";
import { User } from "../models/userModel";
export const initNode = async (req: Request, res: Response) => {
  const node = await (new Node(req.body)).save();
  console.log(node);
  if (!node) {
    // TODO: Add proper handling
    res.sendStatus(404).send('Sorry mate - thats not a node 👎');
  } else {
    res.status(200).send('A master node has been created 👯‍♀️');
  }
};

// Updates sensor data in the DB
export const updateSensorData = async (req: Request, res: Response) => {
  const node = await Node.findOneAndUpdate(
    { _id: req.params.id },
    { $push: { sensorData: req.body.sensorData } },
    { new: true }
  ).exec();

  if (!node) {
    // TODO: Add proper handling
    res.sendStatus(404).send('Sorry mate - no such node 👎');
  } else {
    res.status(200).send('The node has been updated 👯‍♀️');
  }
};

// Updates a node's status and updateStatus property
// If a node is *not* found it will create a new node
// TODO: This might not be needed since we have updateLoad 👋👋👋👋👋👋
export const updateStatus = async (req: Request, res: Response) => {
  const node = await Node.findOneAndUpdate(
    { nodeID: req.params.id },
    { $set: { status: req.body.status, updateStatus: req.body.updateStatus } },
    { upsert: true }
  );

  if (!node) {
    res.status(200).send('A new node has been created 👀');
  } else {
    res.status(200).send('The node has been updated 👯‍♀');
  }
};

// Update sensor data for all nodes at once
export const updateLoad = async (req: Request, res: Response) => {
  let bulk = Node.collection.initializeUnorderedBulkOp();

  req.body.nodes.forEach((node: { nodeID: string, status: string, updateStatus: string; }) => {
    bulk.find({ nodeID: node.nodeID })
      .upsert()
      .update({ $set: { status: node.status, updateStatus: node.updateStatus } });
  });
  // TODO: Error handling here
  bulk.execute();

  res.status(200).send('Your load has been recieved and handled 😏');
};


// Returns the functionality for all nodes that are *Pending* for an update
export const getFunctionality = async (req: Request, res: Response) => {
  let email = req.body.email;

  // Retrieves all nodes that are *Pending* for a new update  
  const nodes = await Node.find({ updateStatus: 'Pending'}, 'nodeID function -_id').exec();
  if(nodes.length === 0){
    res.status(200).send('No nodes waiting to update');
    return;
  }

  // Finds the user based on email
  // TODO: Needs to be done differently
  const user = await User.findOne({ email: email});
  if(user != null){
    let nodeUpdates: object[] = [];
    // For each node that is Pending an 'nodeUpdate' object is pushed to the 'nodeUpdates' array 
    nodes.forEach(async (node: INode) => {
      let func = ensure(user.functionality.find(func => func._id == node.function));
      nodeUpdates.push({
        nodeID: node.nodeID,
        body: {
          setup: func.setup,
          loop: func.loop,
          restart: func.restart
        }
      });
    });
    res.status(200).send(nodeUpdates);
  } else {
    // TODO: Needs to be changed to match the way we are gonna identify the user
    res.status(404).send(`There is no such user: ${email}`);
  }
};

// Throws a TypeError if the functionID does not exist in the user
function ensure<T>(argument: T | undefined | null, message: string = 'This functionID does not exist'): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument;
}