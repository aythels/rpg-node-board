import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { UserModel } from '../../db/models';
import { ObjectId } from 'mongodb';

export const router = express.Router(); // TODO: could this cause trouble if it gets exported at the top of the file?

// TODO: validate ID's!
// TODO:
// Sign up a new user
router.post('/user', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // Create a new user
  const user = new UserModel({
    // TODO: ...
  });
  // Save the user to the database
  try {
    const result = await user.save();
    res.send(result);
  } catch (error) {
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad Request'); // 400 for bad request gets sent to client.
    }
  }
});

// TODO:
// Get user's games
router.get('/user', mongoChecker, authenticate, async (req, res) => {
  try {
    // TODO:
    const students = await UserModel.find({
      // ...
    });
    // ...
    res.send({
      // ...
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal Server Error');
  }
});
