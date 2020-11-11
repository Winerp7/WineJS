import { Request, Response, NextFunction } from 'express';
import { Node } from "../models/nodeModel";

// Updates a node in the DB
export const updateSensorData = async (req: Request, res: Response) => {
  console.log("Data update: ");
  console.log(req.body);
  console.log("Master ", req.body.isMaster);
  console.log("Status ", req.body.status);

  const { isMaster, status } = req.body;
  const updates = Object.entries({ isMaster, status }).filter(isData => isData);
  const result = {};
  Object.assign(result, updates);
  console.log('res ', result);

  console.log('updates ', updates);
  const node = await Node.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: updates,
      $push: { sensorData: req.body.sensorData }
    },
    { new: true }
  ).exec();

  if (!node) {
    // TODO: Add proper handling
    res.sendStatus(404).send('Sorry mate - no such node 👎');
  } else {
    res.status(200).send('The node has been updated 👯‍♀️');
  }
};