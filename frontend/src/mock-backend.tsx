/* eslint-disable sort-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

import { Node, Subnode, Game, User } from './types';

// Hardcoded variables go here:
const globalSubnodes = [
  {
    id: 1,
    node_id: 1,
    editors: [2],
    type: 'description',
    content: '',
  },
  {
    id: 2,
    node_id: 1,
    editors: [2],
    type: 'event',
    content: '',
  },
  {
    id: 3,
    node_id: 1,
    editors: [2],
    type: 'notes',
    content: '',
  },
];

const globalNodes = [
  {
    id: 1,
    name: 'The Soaring Skies',
    image: '',
    image_alt: '',
    subnodes: [],
    editors: [],
    type: 'location',
  },
];

const globalUsers = [
  {
    id: 1,
    username: 'user1',
    password: 'user1',
    email: 'user1@user.com',
    games: [1],
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin',
    email: 'admin@admin.com',
    games: [1],
  },
  {
    id: 3,
    username: 'user2',
    password: 'user2',
    email: 'user2@user.com',
    games: [1],
  },
  {
    id: 4,
    username: 'user3',
    password: 'user3',
    email: 'user3@user.com',
    games: [1],
  },
  {
    id: 5,
    username: 'user4',
    password: 'user4',
    email: 'user4@user.com',
    games: [1],
  },
  {
    id: 6,
    username: 'user5',
    password: 'user5',
    email: 'user5@user.com',
    games: [1],
  },
  {
    id: 7,
    username: 'user6',
    password: 'user6',
    email: 'user6@user.com',
    games: [1],
  },
  {
    id: 8,
    username: 'user7',
    password: 'user7',
    email: 'user7@user.com',
    games: [1],
  },
  {
    id: 9,
    username: 'user8',
    password: 'user8',
    email: 'user8@user.com',
    games: [1],
  },
  {
    id: 10,
    username: 'user8',
    password: 'user8',
    email: 'user8@user.com',
    games: [1],
  },
];

const game1: Game = {
  id: 7,
  title: 'Test game',
  nodes: [1],
  players: [1],
  gms: [2],
  users: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  settings: {},
};

const allGames = [game1];

// Functions mocking backend behaviour go here:

export const GETnodeById = (id: number): Node => {
  return globalNodes.filter((node) => node.id == id)[0];
};

export const GETuserById = (id: number): User => {
  return globalUsers.filter((user) => user.id == id)[0];
};

export const GETuserByUsername = (username: string): User | undefined => {
  return globalUsers.find((user) => user.username == username);
};

export const GETsubnodesByNodeId = (node_id: number): Subnode[] => {
  return globalSubnodes.filter((subnode) => subnode.node_id == node_id);
};

export const GETgame = (id: number): Game => {
  return allGames.filter((game) => game.id === id)[0];
};

export const GETplayers = (gameId: number): User[] => {
  const game = GETgame(gameId);
  return game.users.map(GETuserById);
};

export const POSTaddPlayerToGame = (playerId: number, gameId: number): void => {
  const game = GETgame(gameId);
  game.players.push(playerId);
  game.users.push(playerId);
};

export const POSTremovePlayerFromGame = (playerId: number, gameId: number): void => {
  const game = GETgame(gameId);
  game.players = game.players.filter((id) => id !== playerId);
  game.users = game.users.filter((id) => id !== playerId);
};

export const POSTupdateGameName = (gameId: number, newTitle: string): void => {
  const game = GETgame(gameId);
  game.title = newTitle;
};

export const POSTpromoteUserToGameMaster = (userId: number, gameId: number): void => {
  const game = GETgame(gameId);
  game.gms.push(userId);
};

export const POSTdemoteGameMasterToPlayer = (userId: number, gameId: number): void => {
  const game = GETgame(gameId);
  game.gms = game.gms.filter((id) => id !== userId);
};
