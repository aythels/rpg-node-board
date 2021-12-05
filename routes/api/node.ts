import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel, NodeModel } from '../../db/models';
import { isValidObjectId } from 'mongoose';

export const router = express.Router();

/**********************************Node API************************************/

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

router.post('/node/:gameId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;

  if (!isValidObjectId(gameId)) {
    res.status(404).send();
    return;
  }

  try {
    const newNode = new NodeModel({
      name: req.body.name,
      subnodes: [],
      informationLevels: req.body.informationLevels,
      editors: req.body.editors,
      type: req.body.type,
    });

    if (req.body.thumbnailImage) newNode.thumbnailImage = req.body.thumbnailImage; // TODO: Test
    if (req.body.image) newNode.image = req.body.image; // TODO: Test

    const result = await GameModel.findOneAndUpdate({ _id: gameId }, { $push: { nodes: newNode } });
    res.send(result);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

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
