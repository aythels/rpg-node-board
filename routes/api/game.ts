import express, { Request, Response } from 'express';
import { isMongoError, mongoChecker, authenticate } from '../helpers';
import { GameModel, UserModel } from '../../db/models';
import { UserPermission } from '../../frontend/src/types';

export const router = express.Router();

// TODO: Use ACID transactions for multistep routes (might just wait to switch to SQL db to do this)

// POST: Create game
router.post('/game', mongoChecker, authenticate, async (req: Request, res: Response) => {
  console.log('Creating new game');

  const { userId, title } = req.body;
  const game = new GameModel({
    title,
    nodes: [],
    users: [
      {
        userId,
        permission: UserPermission.gameMaster,
      },
    ],
    settings: {},
    // TODO: use stock images
    // imgpath:
    // image:
  });

  try {
    const result = await game.save();
    await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        $push: { games: result._id },
      },
    );
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

// GET: Retrieve a game
router.get('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only games with ids stored in user data can be retrieved for session user

  console.log('Retrieving game');

  try {
    const { id } = req.params;
    const game = await GameModel.findById(id);
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// DELETE: Delete a game
router.delete('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  // TODO: Ensure that only game with ids in session user data can be deleted

  console.log('Deleting game');

  try {
    const gameId = req.params.id;
    const game = await GameModel.findByIdAndDelete(gameId);
    if (game) {
      // Remove the game ID from every user's list of games
      await Promise.allSettled(
        game.users.map(async (user) => {
          return await UserModel.findByIdAndUpdate(user.userId, {
            $pull: { games: gameId },
          });
        }),
      );
    }
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// PATCH: Update any of the properties of Game
router.patch('/game/:id', mongoChecker, authenticate, async (req: Request, res: Response) => {
  console.log('Updating game');

  const { id } = req.params;
  const updates = req.body; // TODO: perform some validation?
  try {
    const game = await GameModel.findByIdAndUpdate(id, updates, { new: true });
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// ----------------------------------- USER-RELATED ENDPOINTS -----------------------------------
// POST: Add player to game
router.post('/game/:gameId/user/:username', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const { gameId, username } = req.params;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(404).send('User does not exist in the database.');
      return;
    }

    const game = await GameModel.findById(gameId);
    if (!game) {
      res.status(404).send('Game not found');
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

    // Add user to game.users
    const userPermissionRecord = {
      userId: user._id,
      permission: UserPermission.player,
    };
    await GameModel.findOneAndUpdate(
      { _id: gameId },
      { $push: { users: userPermissionRecord } },
      { returnNewDocument: true },
    );

    // Add gameId to user.games
    user.games.push(gameId);

    // Add user to each of game's nodes
    const infoLevel = {
      user: user._id,
      infoLevel: 0,
    };

    for (const node of game.nodes) {
      node.informationLevels.push(infoLevel);
    }

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

// Update a player's permissions in a game (demote to player or promote to GM)
// takes: req.body: { permission: UserPermission }
router.patch('/game/:gameId/user/:userid', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const { gameId, userId } = req.params;
  const newPermission = req.body.permission;

  //TODO: validate body?

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send('User does not exist in the database.');
      return;
    }

    const game = await GameModel.findById(gameId);
    if (!game) {
      res.status(404).send('Game not found');
      return;
    }
    const gamePermission = game.users.find((u) => u.userId === userId);
    if (!gamePermission) {
      res.status(404).send('User not in game');
      return;
    }
    if (gamePermission.permission === newPermission) {
      res.status(400).send('User already holds that permission');
      return;
    }

    // Adjust global permission
    gamePermission.permission = newPermission;

    // Update permissions for all nodes and subnodes
    for (const node of game.nodes) {
      if (newPermission === UserPermission.gameMaster && !node.editors.includes(userId)) {
        node.editors.push(userId);
      } else if (newPermission === UserPermission.player && node.editors.includes(userId)) {
        node.editors = node.editors.filter((e) => e !== userId);
      }
      for (const subnode of node.subnodes) {
        if (newPermission === UserPermission.gameMaster && !subnode.editors.includes(userId)) {
          subnode.editors.push(userId);
        } else if (newPermission === UserPermission.player && subnode.editors.includes(userId)) {
          subnode.editors = subnode.editors.filter((e) => e !== userId);
        }
      }
    }
    await game.save();
    res.send(gamePermission);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// DELETE: Remove player from the game
router.delete('/game/:gameId/user/:userId', mongoChecker, authenticate, async (req: Request, res: Response) => {
  const gameId = req.params.gameId;
  const userId = req.params.userId;

  try {
    const game = await GameModel.findById(gameId);
    if (!game) {
      res.status(404).send('Game not found');
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).send('User not found');
      return;
    }
    // - delete player from game
    game.users = game.users.filter((user) => user.userId !== userId);

    // - delete game from player
    user.games = user.games.filter((game) => game !== gameId);

    // - delete player from each of the game's nodes
    for (const node of game.nodes) {
      node.editors = node.editors.filter((user) => user !== userId);
      node.informationLevels = node.informationLevels.filter((i) => i.user !== userId);
      // - delete player from each of the node's subnodes
      for (const subnode of node.subnodes) {
        subnode.editors = subnode.editors.filter((user) => user !== userId);
      }
    }
    await game.save();
    res.send(game);
  } catch (error) {
    console.log(error);
    if (isMongoError(error)) {
      res.status(500).send('Internal server error');
    } else {
      res.status(400).send('Bad request');
    }
  }
});

// ----------------------------------- NODE-RELATED ENDPOINTS -----------------------------------

// POST: Add node to game (NOTE: this route is handled by node router)
// router.post('/game/:id/node', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// PATCH: Update any of the properties of Node (NOTE: this route is handled by node router)
// router.patch('/game/:gameId/user/:nodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {});

// DELETE: Remove node from game (NOTE: this route is handled by node router)
// router.delete('/game/:gameId/node/:nodeId', mongoChecker, authenticate, async (req: Request, res: Response) => {});
