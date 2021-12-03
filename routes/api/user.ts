import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { UserModel } from '../../db/models';
import { ObjectId } from 'mongodb'; // What is this import used for?

export const router = express.Router();

// Client should not be trusted to handle the storage of game data in user

/***********************************User API***********************************/

// POST: Create user
router.post('/user', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // Example request body
  /* 
    {
      "username": "username",
      "password": "password",
      "email": "email"
    }
  */

  // TODO: Ensure that username and email are unique and permitted
  // TODO: Encrypt sensitive data
  console.log('Creating user', req.body);

  const user = new UserModel({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  });

  try {
    const result = await user.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// GET: Retrieve user
router.get('/user/:username', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only the user corresponding to the session can be retrieved
  // TODO: Probably don't send the password and other sensitive information back

  try {
    const { username } = req.params;
    console.log(`Retrieving user ${username}`);
    // WARNING: Similar database functions perform differently
    // GameModel.findById(req.params.id); returns error if nothing is found
    // GameModel.findOne({ _id: req.params.id }) returns nothing if nothing is found

    console.log({ username });
    const user = await UserModel.findOne({ username });

    res.json(user);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// DELETE: Delete User
router.delete('/user/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only the user corresponding to the session can be deleted
  // TODO: Probably don't send the password and other sensitive information back
  console.log('Deleting user');

  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// PATCH: Partial update all user properties at once
router.patch('/user/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only the user corresponding to the session can be retrieved
  // TODO: Probably don't send the password and other sensitive information back
  // TODO: Ensure that new username and email are unique and permitted
  // TODO: Ensure image is of the proper size
  console.log('Updating user');

  const updates = req.body; // TODO: perform some validation
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.send(user);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else res.status(400).send('Bad request');
  }
});
