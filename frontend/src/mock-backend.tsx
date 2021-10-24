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
    image: '/images/sky.jpg',
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

const game1 = {
  nodes: [1],
  players: [1],
  gms: [2],
  users: [1, 2],
  settings: {},
};

// Functions mocking backend behaviour go here:

export const GETnodeById = (id: number): Node => {
  return globalNodes.filter((node) => node.id == id)[0];
};

export const GETuserById = (id: number): User => {
  return globalUsers.filter((user) => user.id == id)[0];
};

export const GETsubnodesByNodeId = (node_id: number): Subnode[] => {
  return globalSubnodes.filter((subnode) => subnode.node_id == node_id);
};
