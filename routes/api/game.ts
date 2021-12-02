import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel } from '../../db/models';

const router = express.Router();

// POST: Create a game
router.post('/game', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // Create Game

  console.log('Creating new game');

  const game = new GameModel({
    title: 'untitled',
    image: null,
    settings: 'afasf',
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

// GET: Retrive all games
router.get('/game', mongoChecker, authenticate, async (req: Request, res: Response) => {
  console.log('Retriving all games');

  try {
    const game = await GameModel.find({});
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// GET: Retrive a game
router.get('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  console.log('Retriving game');

  try {
    // some database calls do not result in errors even if document doesn't exist
    const game = await GameModel.findOne({ _id: req.params.id });
    if (game) res.send(game);
    else res.status(400).send('Bad request');
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// DELETE: Delete a game
router.delete('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  console.log('Deleting game');

  try {
    // some database calls do not result in errors even if document doesn't exist

    const game = await GameModel.findOneAndDelete({ _id: req.params.id });
    if (game) res.send(game);
    else res.status(400).send('Bad request');
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

export { router as gameRouter };
