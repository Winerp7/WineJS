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

export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
  const node = await Node.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { status: req.body.status, updateStatus: req.body.updateStatus } },
    { new: true, upsert: true },
    (error) => {
      if (error) {
        console.log('💩💩💩💩💩: ');
        next();
      } else {
        console.log("massive success 👏👏👏👏👏👏👏👏👏");
      }
      // error: any errors that occurred
      // doc: the document before updates are applied if `new: false`, or after updates if `new = true`
    }
  ).exec();
  console.log("Got here");

  // async function getTeamById(id) {
  //   if (!mongoose.Types.ObjectId.isValid(id)) {
  //     // handle bad id
  //   }
  //   try {
  //     const team = await Team.findById(id);
  //     if (!team) {
  //       // no team with such id, error handling code
  //     }
  //     // team was obtained, rest of the code
  //   } catch (error) {
  //     // handle query error
  //   }
  // }

  console.log("empty node: ", node);

  if (!node) {
    //initNode;
    res.sendStatus(404).send('Buhu - no such node 👎');

  } else {
    res.status(200).send('The node has been updated 👯‍♀️');
  }

};