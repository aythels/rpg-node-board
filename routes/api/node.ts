import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel, NodeModel, NodeSchema } from '../../db/models';
import { Node } from '../../frontend/src/types'; // TODO: fix where the types file is

const router = express.Router();

/**********************************Node API************************************/

// Note: Are we using req.body or req.params? Should be consistent

router.get('/game/node', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.body.gameId;
  const nodeId = req.body.nodeId;

  try {
    const game = await GameModel.findById(gameId);
    if (game) {
      const node = game.nodes.find((node) => node.id === nodeId);
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

router.post('/game/node', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.body.gameId;

  const newNode = new NodeModel({
    name: req.body.name,
    image: req.body.image,
    thumbnailImage: req.body.thumbnailImage,
    subnodes: req.body.subnodes,
    informationLevels: req.body.informationLevels,
    editors: req.body.editors,
    type: req.body.type,
  });

  try {
    const result = await GameModel.updateOne({ _id: gameId }, { $push: { nodes: newNode } });
    res.send(result);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

router.patch('/game/node', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.body.gameId;
  const nodeId = req.body.nodeId;

  const updatedData: Partial<Node> = {};

  // Construct the changes to apply during PATCH
  if (req.body.name) updatedData.name = req.body.name;
  if (req.body.image) updatedData.image = req.body.image;
  if (req.body.thumbnailImage) updatedData.thumbnailImage = req.body.thumbnailImage;
  if (req.body.informationLevels) updatedData.informationLevels = req.body.informationLevels;
  if (req.body.editors) updatedData.editors = req.body.editors;
  if (req.body.type) updatedData.type = req.body.type;

  try {
    const patchedNode = await GameModel.updateOne(
      { _id: gameId, 'nodes._id': nodeId },
      { $set: updatedData },
      { new: true },
    );
    res.send(patchedNode);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});