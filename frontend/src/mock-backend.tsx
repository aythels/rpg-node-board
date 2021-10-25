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
];

const game1: Game = {
  id: 7,
  title: 'Test game',
  nodes: [1],
  players: [1],
  gms: [2],
  users: [1, 2],
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

export const addUserToGame = (user: User, gameId: number): void => {
  // ...
};

export const removeUserFromGame = (user: User, gameId: number): void => {
  // ...
};

export const updateGameName = (gameId: number, title: string): void => {
  // ...
};

export const promoteUserToGameMaster = (userId: number, gameId: number) => {
  // ...
};

export const demoteGameMasterToPlayer = (userId: number, gameId: number) => {
  // ...
};

export const GETgame = (id: number): Game => {
  return allGames.filter((game) => game.id === id)[0];
};

export const GETplayers = (gameId: number): User[] => {
  const game = GETgame(gameId);
  return game.users.map(GETuserById);
};
