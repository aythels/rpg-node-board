import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel, UserModel } from '../../db/models';
import { ObjectId } from 'mongodb';
import { UserPermission } from '../../frontend/src/types';

export const router = express.Router();

/**********************************Game API************************************/

// POST: Create game
router.post('/game', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // { "title": "title" }

  // TODO: Add the id of this game to the data of the user who created it

  console.log('Creating new game');

  const game = new GameModel({
    title: req.body.title,
  });

  try {
    const result = await game.save();
    res.send(result);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// GET: Retrieve a game
router.get('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only games with ids stored in user data can be retrieved for session user

  console.log('Retrieving game');

  try {
    const { id } = req.params;
    const game = await GameModel.findById(id);
    res.json(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }

  // Non async await version
  /*
  GameModel.findById(req.params.id)
    .then((game) => {
      res.send(game);
    })
    .catch((error) => {
      console.log(error);
      if (isMongoError(error)) res.status(500).send('Internal server error');
      else res.status(400).send('Bad request');
    });
  */
});

// DELETE: Delete a game
router.delete('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only game with ids in session user data can be deleted

  console.log('Deleting game');

  try {
    const game = await GameModel.findByIdAndDelete(req.params.id);
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// POST: Add player to game
router.post('/game/user', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const { gameId, username } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(404).send('User does not exist in the database.');
      return;
    }

    const alreadyInGame = Boolean(
      await GameModel.findOne({
        _id: gameId,
        users: { $elemMatch: { userId: user._id } },
      }),
    );
    if (alreadyInGame) {
      res.status(422).send('User was already added to the game.');
      return;
    }

    const userPermissionRecord = {
      userId: user._id,
      permission: UserPermission.player,
    };
    await GameModel.findOneAndUpdate(
      { _id: gameId },
      { $push: { users: userPermissionRecord } },
      { returnNewDocument: true },
    );
    res.send(userPermissionRecord);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// PUT: Update game title
router.put('/game/title/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// PUT: Update game image
router.put('/game/image/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// DELETE: Remove game player - TODO
router.delete('/game/player/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// PUT: Change game player nickname - TODO
router.put('/game/player/edit-nickname/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// PUT: Change game player permissions - TODO
router.put('/game/player/edit-permission/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// POST: Add game node - TODO
router.post('/game/node/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// DELETE: Remove game node - TODO
router.delete('/game/node/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

export { router as gameRouter };
