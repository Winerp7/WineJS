import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { INode, Node } from "../models/nodeModel";
import { Functionality } from "../models/functionalityModel";

// When a node is first connected to the network, it will make a initNode request
export const initNode = async (req: Request, res: Response) => {
  const owner = objectId(req.query.id as string);

  // If the node already exists then dont do anything
  // TODO: if master inits and exists get all functionality
  const existingNode = await Node.findOne({ nodeID: req.body.nodeID, owner: owner });
  if (existingNode) {
    res.status(200).send('Node already exists');
    return;
  }

  // If it is a new node, then create a new node in the database
  req.body.owner = owner;
  const node = await (new Node(req.body)).save();
  if (!node) {
    // TODO: Add proper handling
    res.status(404).send('Sorry mate - thats not a node 👎');
  } else {
    res.status(200).send('A master node has been created 👯‍♀️');
  }
};

// Updates sensor data in the DB
export const updateSensorData = async (req: Request, res: Response) => {
  const owner = objectId(req.query.id as string);

  const body = convertSensorData(req.body);
  let bulk = Node.collection.initializeUnorderedBulkOp();
  body.forEach((node: {nodeID: string, data: {sensor: string, value: number, time: string}[]}) => {
    bulk.find({nodeID: node.nodeID, owner: owner})
      .update({ $push: { sensorData: {$each: node.data } }});
  });
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
  //Finds all functionality, which needs to be sent to the master node
  //@ts-ignore
  const allFuncs = await Functionality.findFuncsForNodes(nodes, owner);

  // For each node that is Pending an 'nodeUpdate' object is pushed to the 'nodeUpdates' array 
  let nodeUpdates: {nodeID: string, body: {setup: string, loop: string, reboot: boolean, sleep: boolean}}[] = [];

  // Finds the specific func for a node and adds it to nodeUpdates
  nodes.forEach(async (node: INode) => {
    const func = allFuncs.find((f: {_id: string, setup: string, loop: string, reboot: boolean}) => f._id == String(node.function));
    nodeUpdates.push(createNodeUpdate(node, func));
  });
  res.status(200).send(JSON.stringify(nodeUpdates).replace(/\\\\/g, '\\'));
};

// Creates the object which is returned to a master with a nodes functionality
function createNodeUpdate(node: INode, func: {_id: string, setup: string, loop: string, reboot: boolean}){
  let body: { setup: string, loop: string, reboot: boolean, sleep: boolean }
  if(func == undefined){
    body = { setup: '', loop: '', reboot: false, sleep: true }
  } else {
    body = { setup: func.setup, loop: func.loop, reboot: func.reboot, sleep: true }
  }
  return {
    nodeID: node.nodeID,
    body: body
  }
}

function objectId(s: string){
  return mongoose.Types.ObjectId(s);
}

// TODO: Thats an any
function convertSensorData(body: any){
  let newBody = []
  for(let nodeID in body){
    let nodeBody = body[nodeID];
    let sensorData = [];
    for (let data in nodeBody){
      let sensor = ''; let value = 0; let time = ''
      Object.keys(nodeBody[data]).forEach((field: string) => {
        if(field != 'time'){ sensor = field; value = nodeBody[data][sensor]} else { time = nodeBody[data]['time']}
      });
      sensorData.push({sensor: sensor, value: value, time: time})
    }
    newBody.push({nodeID: nodeID, data: sensorData})
  }
  return newBody;
}