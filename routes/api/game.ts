import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel } from '../../db/models';

const router = express.Router();

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

// GET: Retrive a game
router.get('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only games with ids stored in user data can be retrived for session user

  console.log('Retriving game');

  try {
    const game = await GameModel.findById(req.params.id);
    res.send(game);
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

/*****************************Game Properties API******************************/

// PUT: Update game title
router.put('/game/title/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// PUT: Update game image
router.put('/game/image/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

/*****************************Game Child Properties API************************/

// POST: Add game player
router.post('/game/player/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// DELETE: Remove game player
router.delete('/game/player/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// PUT: Change game player nickname
router.put('/game/player/edit-nickname/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// PUT: Change game player permissions
router.put('/game/player/edit-permission/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// POST: Add game node
router.post('/game/node/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// DELETE: Remove game node
router.delete('/game/node/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {});

export { router as gameRouter };
