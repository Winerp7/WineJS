import { Request, Response, NextFunction} from 'express';
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

export const updateStatus = async (req: Request, res: Response) => {

  console.log("booty :P :P :P ", req.body);
  console.log("hmmmmm");
  console.log(req.body.status, req.body.updateStatus);

  const node = await Node.findOneAndUpdate(
    { nodeID: 'jens123' },
    { $set: { status: req.body.status, updateStatus: req.body.updateStatus } },
    { upsert: true, new: true }
  );

  console.log("THIS SUCKS");
  console.log("empty node: ", node);

  // if (!node) {
  //   //initNode;
  //   res.sendStatus(404).send('Buhu - no such node 👎');

  // } else {
  //   res.status(200).send('The node has been updated 👯‍♀️');
  // }

};