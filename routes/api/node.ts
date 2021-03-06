import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel, NodeModel } from '../../db/models';
import { isValidObjectId } from 'mongoose';
import { Node, UserPermission } from '../../frontend/src/types';

export const router = express.Router();

/**********************************Node API************************************/
// GET a node within a game
router.get('/node/:gameId/:nodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  const nodeId = req.params.nodeId;

  if (!isValidObjectId(gameId) || !isValidObjectId(nodeId)) {
    res.status(404).send();
    return;
  }

  try {
    const game = await GameModel.findById(gameId);
    if (game) {
      const node = game.nodes.find((node) => '' + node._id === nodeId);
      if (node) {
        res.send(node);
      } else {
        res.status(404).send('Node not found');
      }
    } else {
      res.status(404).send('Game not found');
    }
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// POST: add a default node to a game
router.post('/node/:gameId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;

  if (!isValidObjectId(gameId)) {
    res.status(404).send('Invalid id');
    return;
  }

  try {
    const game = await GameModel.findById(gameId);
    if (!game) {
      res.status(404).send('Cannot find game');
      return;
    }
    const { thumbnailImage, image } = req.body;
    const newNode: Omit<Node, '_id'> = {
      name: 'Default',
      type: 'default',
      editors: game.users.filter((u) => u.permission === UserPermission.gameMaster).map((u) => u.userId),
      thumbnailImage,
      image,
      imageAlt: '',
      subnodes: [],
      informationLevels: [],
      x: 0,
      y: 0,
    };
    const node = new NodeModel(newNode);

    for (const user of game.users) {
      const infoLevel = {
        user: user.userId,
        infoLevel: 0,
      };
      node.informationLevels.push(infoLevel);
    }

    await GameModel.findOneAndUpdate({ _id: gameId }, { $push: { nodes: node } });
    res.send(node);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// PATCH: update a node within a game
router.patch('/node/:gameId/:nodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  const nodeId = req.params.nodeId;

  if (!isValidObjectId(gameId) || !isValidObjectId(nodeId)) {
    res.status(404).send();
    return;
  }

  //TODO: Validate req.body?

  try {
    const game = await GameModel.findById(gameId);
    if (game) {
      const node = game.nodes.find((node) => '' + node._id === nodeId);
      if (node) {
        // TODO: decouple from schema
        if (req.body.name) node.name = req.body.name;
        if (req.body.image) node.image = req.body.image;
        if (req.body.thumbnailImage) node.thumbnailImage = req.body.thumbnailImage;
        if (req.body.subnodes) node.subnodes = req.body.subnodes;
        if (req.body.informationLevels) node.informationLevels = req.body.informationLevels;
        if (req.body.editors) node.editors = req.body.editors;
        if (req.body.types) node.type = req.body.type;
        if (req.body.x) node.x = req.body.x;
        if (req.body.y) node.y = req.body.y;
        await game.save();
        res.send(node);
      } else {
        res.status(404).send('Node not found');
      }
    } else {
      res.status(404).send('Game not found');
    }
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// DELETE: remove a node from a game
router.delete('/node/:gameId/:nodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  const nodeId = req.params.nodeId;

  if (!isValidObjectId(gameId) || !isValidObjectId(nodeId)) {
    res.status(404).send();
    return;
  }

  try {
    const game = await GameModel.findById(gameId);
    if (game) {
      const node = game.nodes.find((node) => '' + node._id === nodeId);
      if (node) {
        game.nodes = game.nodes.filter((n) => n !== node);
        await game.save();
        res.send(node);
      } else {
        res.status(404).send('Node not found');
      }
    } else {
      res.status(404).send('Game not found');
    }
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});
