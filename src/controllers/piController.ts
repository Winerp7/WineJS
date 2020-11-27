import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { INode, Node } from "../models/nodeModel";
import { User } from "../models/userModel";

// When a node is first connected to the network, it will make a initNode request
export const initNode = async (req: Request, res: Response) => {
  const owner = objectId(req.query.id as string);

  // If the node already exists then dont do anything
  // TODO: if master inits and exists get all functionality
  const existingNode = await Node.findOne({ nodeID: req.body.nodeID, owner: owner });
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
  const owner = objectId(req.query.id as string);

  let bulk = Node.collection.initializeUnorderedBulkOp();
  for (let nodeID in req.body) {
    bulk.find({nodeID: nodeID, owner: owner})
      .update({ $push: { sensorData: {$each: req.body[nodeID] } }});
  }
  bulk.execute();
 
  res.status(200).send('The data has been added 👯‍♀️');
};

// Update status for all nodes at once
export const updateNodes = async (req: Request, res: Response) => {
  const owner = objectId(req.query.id as string);

  let bulk = Node.collection.initializeUnorderedBulkOp();
  req.body.forEach((node: { nodeID: string, status: string, updateStatus: string; }) => {
    bulk.find({ nodeID: node.nodeID, owner: owner })
      .update({ $set: { status: node.status, updateStatus: node.updateStatus } });
  });
  // TODO: Error handling here
  bulk.execute();

  res.status(200).send('Your load has been recieved and handled 😏');
};


// Returns the functionality for all nodes that are *Pending* for an update
export const getFunctionality = async (req: Request, res: Response) => {
  const owner = objectId(req.query.id as string);

  // Retrieves all nodes that are *Pending* for a new update  
  const nodes = await Node.find({ owner: owner, updateStatus: 'Pending'}, 'nodeID function -_id').exec();
  if(nodes.length === 0){
    res.status(200).send('No nodes waiting to update');
    return;
  }

  // Finds all the functionality for the nodes
  // @ts-ignore
  const allFuncs = await User.findSomeFunctionality(nodes, owner);

  // For each node that is Pending an 'nodeUpdate' object is pushed to the 'nodeUpdates' array 
  let nodeUpdates: {nodeID: string, body: {setup: string, loop: string, reboot: boolean, sleep: boolean}}[] = [];
  nodes.forEach(async (node: INode) => {
    const func = allFuncs.find((f: {functionality: {_id: string}}) => f.functionality._id == node.function).functionality;  
    
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
};

function objectId(s: string){
  return mongoose.Types.ObjectId(s);
}