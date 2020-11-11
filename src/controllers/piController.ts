import { Request, Response, NextFunction } from 'express';
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