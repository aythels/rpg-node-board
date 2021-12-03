import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { UserModel } from '../../db/models';

export const router = express.Router();

// Client should not be trusted to handle the storage of game data in user

// POST: Create user
router.post('/user', mongoChecker, authenticate, async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const uniqueUsername = !(await UserModel.findOne({ username }));
    const uniqueEmail = !(await UserModel.findOne({ email }));
    if (!uniqueUsername || !uniqueEmail) {
      res.status(403).send('Username and email must be unique.');
      return;
    }

    console.log('Creating user', req.body);
    const user = new UserModel({ username, password, email });
    const result = await user.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// TODO: Ensure that only the user corresponding to the session can be retrieved
// TODO: Probably don't send the password and other sensitive information back
// GET: Retrieve user by ID
router.get('/user/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log(`Retrieving user ${id}`);

    const user = await UserModel.findById(id);
    res.send(user);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// GET: Retrieve user by username
router.get('/user/username/:username', mongoChecker, authenticate, async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    console.log(`Retrieving user ${username}`);

    const user = await UserModel.findOne({ username });
    res.send(user);
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
  console.log('Deleting user');

  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// PATCH: Partial update all user properties at once
router.patch('/user/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only the user corresponding to the session can be retrieved
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
    } else {
      res.status(400).send('Bad request');
    }
  }
});
