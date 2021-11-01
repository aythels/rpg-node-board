/* eslint-disable sort-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Delta from 'quill-delta';
import { Node, Subnode, Game, User } from './types';
import CloneDeep from 'lodash.clonedeep';

// Hardcoded variables go here:
const globalSubnodes = [
  {
    id: 1,
    node_id: 1,
    informationLevel: 1,
    editors: [2],
    type: 'description',
    name: 'Description',
    content: new Delta({
      ops: [
        { insert: 'A vast sky. The ' },
        { attributes: { link: '/nodeviewAdmin/3' }, insert: 'Lonely Path' },
        { insert: ' can be found here.\n' },
      ],
    }),
  },
  {
    id: 2,
    node_id: 1,
    informationLevel: 2,
    editors: [2],
    type: 'event',
    name: 'Sky is Falling',
    content: new Delta({ ops: [{ insert: 'The sky is falling!' }] }),
  },
  {
    id: 3,
    node_id: 1,
    informationLevel: 1,
    editors: [1],
    type: 'notes',
    name: 'Notes',
    content: new Delta({ ops: [{ insert: 'wow sure looks cool!' }] }),
  },
  {
    id: 4,
    node_id: 2,
    informationLevel: 1,
    editors: [2],
    type: 'description',
    name: 'Description',
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
    informationLevel: 1,
    editors: [2],
    type: 'description',
    name: 'Description',
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
    informationLevel: 1,
    editors: [2],
    type: 'description',
    name: 'Description',
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
    imageAlt: '',
    informationLevels: {
      1: 0,
      3: 1,
      4: 1,
      5: 2,
    },
    subnodes: [],
    editors: [2, 1],
    type: 'location',
  } as Node,
  {
    id: 2,
    name: 'Museum',
    image: '/images/museum.jpg',
    imageAlt: '',
    informationLevels: {
      1: 0,
      3: 1,
      4: 1,
      5: 2,
    },
    subnodes: [],
    editors: [2],
    type: 'location',
  },
  {
    id: 3,
    name: 'Lonely Path',
    image: '/images/path.jpg',
    imageAlt: '',
    informationLevels: {
      1: 0,
      3: 1,
      4: 1,
      5: 2,
    },
    subnodes: [],
    editors: [2],
    type: 'location',
  },
  {
    id: 4,
    name: 'St. George',
    image: '/images/stgeorge.jpg',
    imageAlt: '',
    informationLevels: {
      1: 0,
      3: 1,
      4: 1,
      5: 2,
    },
    subnodes: [],
    editors: [2],
    type: 'location',
  },
];

const globalUsers = [
  {
    id: 1,
    username: 'user',
    password: 'user',
    email: 'user@user.com',
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
    username: 'user1',
    password: 'user1',
    email: 'user1@user.com',
    games: [1],
  },
  {
    id: 4,
    username: 'user2',
    password: 'user2',
    email: 'user2@user.com',
    games: [1],
  },
  {
    id: 5,
    username: 'user3',
    password: 'user3',
    email: 'user3@user.com',
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
    title: 'Test Game',
    settings: {},
  },
];

// Functions mocking backend behaviour go here:

// TODO: change all filter()s to find()s

export const GETnodeById = (id: number): Node => {
  return CloneDeep(globalNodes.filter((node) => node.id == id)[0]);
};

export const GETuserById = (id: number): User => {
  return CloneDeep(globalUsers.filter((user) => user.id == id)[0]);
};

export const GETsubnodesVisibleToUser = (nodeId: number, userId: number): Subnode[] => {
  const node = globalNodes.filter((node) => node.id == nodeId)[0] as Node;
  const allSubnodes = globalSubnodes.filter((subnode) => subnode.node_id == nodeId);
  let visibleSubodes;
  if (node.editors.includes(userId)) {
    visibleSubodes = allSubnodes;
  } else {
    visibleSubodes = allSubnodes.filter((subnode) => subnode.informationLevel <= node.informationLevels[userId]);
  }
  return CloneDeep(visibleSubodes);
};

export const POSTsubnodeContent = (id: number, newContent: Delta): void => {
  const subnode = globalSubnodes.filter((subnode) => subnode.id == id)[0];
  subnode.content.compose(newContent);
};

export const GETuserCanEditSubnode = (userId: number, subnodeId: number): boolean => {
  const subnode = globalSubnodes.filter((subnode) => subnode.id == subnodeId)[0];
  return CloneDeep(subnode.editors.includes(userId));
};

export const GETuserCanEditNode = (userId: number, nodeId: number): boolean => {
  const node = globalNodes.filter((node) => node.id == nodeId)[0];
  return CloneDeep(node.editors.includes(userId));
};

export const GETnodesInGame = (gameId: number): Node[] => {
  const game = globalGames.filter((game) => game.id == gameId)[0];
  const nodes = [];
  for (const nodeid of game.nodes) {
    nodes.push(globalNodes[nodeid - 1]);
  }
  return CloneDeep(nodes);
};

export const GETeditorsForNode = (nodeId: number): User[] => {
  const node = globalNodes.filter((node) => node.id == nodeId)[0];
  const users = globalUsers.filter((user) => node.editors.includes(user.id));
  return CloneDeep(users);
};

export const GETplayersForNode = (nodeId: number): User[] => {
  const node = globalNodes.filter((node) => node.id == nodeId)[0];
  const users = globalUsers.filter((user) => !node.editors.includes(user.id));
  return CloneDeep(users);
};

export const GETuserIsGMInGame = (userId: number, gameId: number): boolean => {
  const game = globalGames.filter((game) => game.id == gameId)[0];
  return CloneDeep(game.gms.includes(userId));
};

export const GETgameById = (gameId: number): Game => {
  const game = globalGames.filter((game) => game.id == gameId)[0];
  return CloneDeep(game);
};

export const GETsubnodesByNodeId = (nodeId: number): Subnode[] => {
  return CloneDeep(globalSubnodes.filter((subnode) => subnode.node_id == nodeId));
};

export const POSTnode = (node: Node): void => {
  const existingNode = globalNodes.filter((n) => n.id == node.id)[0];
  const index = globalNodes.indexOf(existingNode);
  if (index !== -1) {
    globalNodes[index] = CloneDeep(node);
  }
  // FOR DEBUG:
  const newNode = globalNodes.filter((n) => n.id == node.id)[0] as Node;
  console.log('New value for node is:', newNode);
};
