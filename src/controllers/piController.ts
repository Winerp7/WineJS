import { Request, Response, NextFunction } from 'express';
import { Node } from "../models/nodeModel";

// Updates a node in the DB
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