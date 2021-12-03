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
  console.log('Creating user');

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

// GET: Retrive user
router.get('/user/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only the user corresponding to the session can be retrived
  // TODO: Probably don't send the password and other sensitive information back
  console.log('Retriving user');

  try {
    // WARNING: Similar database functions perform differently
    // GameModel.findById(req.params.id); returns error if nothing is found
    // GameModel.findOne({ _id: req.params.id }) returns nothing if nothing is found

    const user = await UserModel.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// DELETE: Delete User
router.delete('/user/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only the user corresponding to the session can be retrived
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

/********************************User Properties API***************************/

// Helper function cause I'm too lazy to retype code
async function updateUser(req: Request, res: Response, userId: string, updateObj: any) {
  // TODO: Ensure that properties are unique and valid if applicable
  // TODO: Ensure that only the current session user can be updated
  // TODO: Probably don't send everything back

  console.log('Updating user');

  try {
    const user = await UserModel.findByIdAndUpdate(userId, updateObj, { new: true });
    res.send(user);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
}

// PUT: Update username
router.put('/user/edit-username/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // {payload: "new username"}
  updateUser(req, res, req.params.id, { username: req.body.payload });
});

// PUT: Update password
router.put('/user/edit-password/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // {payload: "new password"}
  updateUser(req, res, req.params.id, { password: req.body.payload });
});

// PUT: Update email
router.put('/user/edit-email/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // {payload: "new email"}
  updateUser(req, res, req.params.id, { email: req.body.payload });
});

// PUT: Update profile image
router.put('/user/edit-profileimage/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // {payload: "new image"}
  updateUser(req, res, req.params.id, { profileImage: req.body.payload });
});

// PATCH: Partial update all user properties at once
router.patch('/user/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // Example request body
  /* 
    {
      "username": "username",
      "password": "password",
      "email": "email",
      "profileImage": "profileImage"
    }
  */

  // TODO: Ensure that only the user corresponding to the session can be retrived
  // TODO: Probably don't send the password and other sensitive information back
  // TODO: Ensure that new username and email are unique and permitted
  // TODO: Ensure image is of the proper size

  console.log('Updating user');

  const updatedData: any = {};

  if (req.body.username) updatedData.username = req.body.username; // PATCH: username
  if (req.body.password) updatedData.password = req.body.password; // PATCH: password
  if (req.body.email) updatedData.email = req.body.email; // PATCH: email
  if (req.body.profileImage) updatedData.profileImage = req.body.profileImage; // PATCH: profileImage

  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });
    res.send(user);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});
