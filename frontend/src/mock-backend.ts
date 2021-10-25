/* eslint-disable sort-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Delta from 'quill-delta';
import { Node, Subnode, Game, User } from './types';

// Hardcoded variables go here:
const globalSubnodes = [
  {
    id: 1,
    node_id: 1,
    editors: [2],
    type: 'description',
    content: new Delta({ ops: [{ insert: 'A vast sky.' }] }),
  },
  {
    id: 2,
    node_id: 1,
    editors: [2],
    type: 'event',
    content: new Delta({ ops: [{ insert: 'The sky is falling!' }] }),
  },
  {
    id: 3,
    node_id: 1,
    editors: [1],
    type: 'notes',
    content: new Delta({ ops: [{ insert: 'wow sure looks cool!' }] }),
  },
  {
    id: 4,
    node_id: 2,
    editors: [2],
    type: 'description',
    content: new Delta({
      ops: [
        { insert: 'A place of great knowledge. Near by ' },
        { attributes: { link: '/nodeviewAdmin/4' }, insert: 'St George' },
        { insert: '.\n' },
      ],
    }),
  },
  {
    id: 5,
    node_id: 3,
    editors: [2],
    type: 'description',
    content: new Delta({
      ops: [
        { insert: 'Somewhere to walk underneath ' },
        { attributes: { link: '/nodeviewAdmin/1' }, insert: 'The Soaring Skies' },
        { insert: '.' },
      ],
    }),
  },
  {
    id: 6,
    node_id: 4,
    editors: [2],
    type: 'description',
    content: new Delta({
      ops: [
        { insert: 'The center of UofT. Near ' },
        { attributes: { link: '/nodeviewAdmin/2' }, insert: 'Museum' },
        { insert: '.' },
      ],
    }),
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
  {
    id: 2,
    name: 'Museum',
    image: '/images/museum.jpg',
    image_alt: '',
    subnodes: [],
    editors: [],
    type: 'location',
  },
  {
    id: 3,
    name: 'Lonely Path',
    image: '/images/path.jpg',
    image_alt: '',
    subnodes: [],
    editors: [],
    type: 'location',
  },
  {
    id: 4,
    name: 'St. George',
    image: '/images/stgeorge.jpg',
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

const globalGames = [
  {
    id: 1,
    nodes: [1, 2, 3, 4],
    players: [1],
    gms: [2],
    users: [1, 2],
    settings: {},
  },
];

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

export const POSTsubnodeContent = (id: number, newContent: Delta): void => {
  const subnode = globalSubnodes.filter((subnode) => subnode.id == id)[0];
  subnode.content.compose(newContent);
};

export const GETuserCanEditSubnode = (userId: number, subnodeId: number): boolean => {
  const subnode = globalSubnodes.filter((subnode) => subnode.id == subnodeId)[0];
  return subnode.editors.includes(userId);
};

export const GETnodesInGame = (gameId: number): Node[] => {
  const game = globalGames.filter((game) => game.id == gameId)[0];
  const nodes = [];
  for (const nodeid of game.nodes) {
    nodes.push(globalNodes[nodeid - 1]);
  }
  return nodes;
};
