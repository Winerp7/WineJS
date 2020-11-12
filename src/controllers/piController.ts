import { Request, Response } from 'express';
import { Node } from "../models/nodeModel";

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