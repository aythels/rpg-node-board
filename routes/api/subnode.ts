import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel, NodeModel, SubnodeModel } from '../../db/models';
import { isValidObjectId } from 'mongoose';
import { Subnode } from '../../frontend/src/types';

export const router = express.Router();

/**********************************Node API************************************/
// GET a subnode from a node within a game
router.get('/subnode/:gameId/:nodeId/:subnodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  const nodeId = req.params.nodeId;
  const subnodeId = req.params.subnodeId;

  if (!isValidObjectId(gameId) || !isValidObjectId(nodeId) || !isValidObjectId(subnodeId)) {
    res.status(404).send();
    return;
  }

  try {
    const game = await GameModel.findById(gameId);
    if (game) {
      const node = game.nodes.find((node) => '' + node._id === nodeId);
      if (node) {
        const subnode = node.subnodes.find((subnode) => '' + subnode._id === subnodeId);
        if (subnode) {
          res.send(subnode);
        } else {
          res.status(404).send('Subnode not found');
        }
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

// POST: add a subnode to a node within a game
router.post('/subnode/:gameId/:nodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  const nodeId = req.params.nodeId;

  if (!isValidObjectId(gameId) || !isValidObjectId(nodeId)) {
    res.status(404).send();
    return;
  }

  try {
    const { name, informationLevel, editors, type, content } = req.body;
    const newSubnode: Omit<Subnode, '_id'> = {
      name,
      informationLevel,
      editors,
      type,
      content, // TODO: make sure it is a Delta
    };
    const subnode: Subnode = new SubnodeModel(newSubnode);

    await GameModel.findOneAndUpdate({ _id: gameId, 'nodes._id': nodeId }, { $push: { 'nodes.$.subnodes': subnode } });
    res.send(subnode);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) res.status(500).send('Internal server error');
    else res.status(400).send('Bad request');
  }
});

// PATCH: update a subnode within a node within a game
router.patch('/subnode/:gameId/:nodeId/:subnodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  const nodeId = req.params.nodeId;
  const subnodeId = req.params.subnodeId;

  if (!isValidObjectId(gameId) || !isValidObjectId(nodeId) || !isValidObjectId(subnodeId)) {
    res.status(404).send();
    return;
  }

  //TODO: Validate req.body?

  try {
    const game = await GameModel.findById(gameId);
    if (game) {
      const node = game.nodes.find((node) => '' + node._id === nodeId);
      if (node) {
        const subnode = node.subnodes.find((subnode) => '' + subnode._id === subnodeId);
        if (subnode) {
          // TODO: decouple this
          if (req.body.informationLevel) subnode.informationLevel = req.body.informationLevel;
          if (req.body.name) subnode.name = req.body.name;
          if (req.body.type) subnode.type = req.body.type;
          if (req.body.editors) subnode.editors = req.body.editors;
          if (req.body.content) subnode.content = req.body.content;
          await game.save();
          res.send(subnode);
        } else {
          res.status(404).send('Subnode not found');
        }
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

// DELETE: remove a subnode from a node within a game
router.delete(
  '/subnode/:gameId/:nodeId/:subnodeId',
  mongoChecker,
  authenticate,
  async (req: Request, res: Response) => {
    const gameId = req.params.gameId;
    const nodeId = req.params.nodeId;
    const subnodeId = req.params.subnodeId;

    if (!isValidObjectId(gameId) || !isValidObjectId(nodeId) || !isValidObjectId(subnodeId)) {
      res.status(404).send();
      return;
    }

    //TODO: Validate req.body?

    try {
      const game = await GameModel.findById(gameId);
      if (game) {
        const node = game.nodes.find((node) => '' + node._id === nodeId);
        if (node) {
          const subnode = node.subnodes.find((subnode) => '' + subnode._id === subnodeId);
          if (subnode) {
            node.subnodes = node.subnodes.filter((s) => s !== subnode);
            await game.save();
            res.send(subnode);
          } else {
            res.status(404).send('Subnode not found');
          }
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
  },
);
