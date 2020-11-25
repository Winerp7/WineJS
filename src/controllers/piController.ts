import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { INode, Node } from "../models/nodeModel";
import { User } from "../models/userModel";

// When a node is first connected to the network, it will make a initNode request
export const initNode = async (req: Request, res: Response) => {
  const owner = mongoose.Types.ObjectId(req.query.id as string);
  console.log("owner init", owner)

  // If the node already exists then dont do anything
  // TODO: if master inits and exists get all functionality
  const existingNode = await Node.findOne({ nodeID: req.body.nodeID });
  if (existingNode) {
    res.status(200).send('Already exists');
    return;
  }

  // If it is a new node, then create a new node in the database
  req.body.owner = owner;
  const node = await (new Node(req.body)).save();
  if (!node) {
    // TODO: Add proper handling
    res.sendStatus(404).send('Sorry mate - thats not a node 👎');
  } else {
    res.status(200).send('A master node has been created 👯‍♀️');
  }
};

// Updates sensor data in the DB
export const updateSensorData = async (req: Request, res: Response) => {
  const owner = mongoose.Types.ObjectId(req.query.id as string);

  let bulk = Node.collection.initializeUnorderedBulkOp();
  for (let nodeID in req.body) {
    bulk.find({nodeID: nodeID, owner: owner})
      .update({ $push: { sensorData: {$each: req.body[nodeID] } }});
  }
  bulk.execute();

  res.status(200).send('The data has been added 👯‍♀️');
};

// Update sensor data for all nodes at once
export const updateLoad = async (req: Request, res: Response) => {
  const owner = mongoose.Types.ObjectId(req.query.id as string);
  console.log("owner", owner)
  

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
  let owner = mongoose.Types.ObjectId(req.query.id as string);
  console.log("owner getFunc", owner)

  // Retrieves all nodes that are *Pending* for a new update  
  const nodes = await Node.find({ owner: owner, updateStatus: 'Pending'}, 'nodeID function -_id').exec();
  if(nodes.length === 0){
    res.status(200).send('No nodes waiting to update');
    return;
  }

  // Finds the user based on _id
  const user = await User.findOne({ _id: owner});
  if(user != null){
    // @ts-ignore
    const functionality = await User.findSomeFunctionality(nodes, user);

    // For each node that is Pending an 'nodeUpdate' object is pushed to the 'nodeUpdates' array 
    let nodeUpdates: object[] = [];
    nodes.forEach(async (node: INode) => {
      const func = functionality.find((func: {functionality: {_id: string}}) => func.functionality._id == node.function).functionality;
      
      console.log("func", func)
      nodeUpdates.push({
        nodeID: node.nodeID,
        body: {
          setup: func.setup,
          loop: func.loop,
          reboot: false,
          sleep: false // TODO: Wus fix
        }
      });
    });

    res.status(200).send(JSON.stringify(nodeUpdates).replace(/\\\\/g, '\\'));
  } else {
    // TODO: Needs to be changed to match the way we are gonna identify the user
    res.status(404).send(`There is no such user: ${owner}`);
  }
};

// Throws a TypeError if the functionID does not exist in the user
export function ensure<T>(argument: T | undefined | null, message: string = 'This functionID does not exist'): T {
  if (argument === undefined || argument === null) {
    throw new TypeError(message);
  }
  return argument;
}