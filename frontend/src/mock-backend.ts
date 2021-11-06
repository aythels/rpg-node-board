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
        { attributes: { nodelink: '3' }, insert: 'Lonely Path' },
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
        { attributes: { nodelink: '4' }, insert: 'St. George' },
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
        { attributes: { nodelink: '1' }, insert: 'The Soaring Skies' },
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
        { attributes: { nodelink: '2' }, insert: 'Museum' },
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

const globalUsers: User[] = [
  {
    id: 1,
    username: 'user1',
    password: 'user1',
    email: 'user1@user.com',
    games: [1],
    images: [],
    profilePicture: '/images/profile_picture_1.png',
  },
  {
    id: 2,
    username: 'admin',
    password: 'admin',
    email: 'admin@admin.com',
    games: [1],
    images: ['/images/sky.jpg', '/images/path.jpg', '/images/stgeorge.jpg', '/images/museum.jpg'],
    profilePicture: '/images/profile_picture_2.png',
  },
  {
    id: 3,
    username: 'user2',
    password: 'user2',
    email: 'user2@user.com',
    games: [1],
    images: ['/images/stgeorge.jpg', '/images/path.jpg', '/images/museum.jpg', '/images/sky.jpg'],
    profilePicture: '/images/profile_picture_2.png',
  },
  {
    id: 4,
    username: 'user3',
    password: 'user3',
    email: 'user3@user.com',
    games: [1],
    images: [],
    profilePicture: '/images/profile_picture_4.png',
  },
  {
    id: 5,
    username: 'user4',
    password: 'user4',
    email: 'user4@user.com',
    games: [1],
    images: [],
    profilePicture: '/images/profile_picture_5.png',
  },
  {
    id: 6,
    username: 'user5',
    password: 'user5',
    email: 'user5@user.com',
    games: [1],
    images: [],
    profilePicture: '/images/profile_picture_6.png',
  },
  {
    id: 7,
    username: 'user6',
    password: 'user6',
    email: 'user6@user.com',
    games: [1],
    images: [],
    profilePicture: '/images/profile_picture_7.png',
  },
  {
    id: 8,
    username: 'user7',
    password: 'user7',
    email: 'user7@user.com',
    games: [1],
    images: [],
  },
  {
    id: 9,
    username: 'user8',
    password: 'user8',
    email: 'user8@user.com',
    games: [1],
    images: [],
  },
  {
    id: 10,
    username: 'user8',
    password: 'user8',
    email: 'user8@user.com',
    games: [1],
    images: [],
  },
  {
    id: 11,
    username: 'user9',
    password: 'user9',
    email: 'user9@user.com',
    games: [1],
    images: [],
    profilePicture: '/images/profile_picture_11.png',
  },
  {
    id: 12,
    username: 'user10',
    password: 'user10',
    email: 'user10@user.com',
    games: [1],
    images: [],
  },
];

let globalGames: Game[] = [
  {
    id: 1,
    title: 'Test Game',
    nodes: [1, 2, 3, 4],
    players: [1],
    gms: [2],
    users: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    settings: {},
  },
  {
    id: 7,
    title: 'Test game 7',
    nodes: [1],
    players: [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    gms: [2],
    users: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    settings: {},
  },
];

// Functions mocking backend behaviour go here:

export const GETuserByUsername = (username: string): User | undefined => {
  return globalUsers.find((user) => user.username == username);
};

export const GETplayers = (gameId: number): User[] => {
  const game = GETgameById(gameId);
  return game.users.map(GETuserById);
};

export const POSTaddPlayerToGame = (playerId: number, gameId: number): void => {
  const game = GETgameById(gameId);
  game.players.push(playerId);
  game.users.push(playerId);
};

export const POSTremovePlayerFromGame = (playerId: number, gameId: number): void => {
  const game = GETgameById(gameId);
  game.players = game.players.filter((id) => id !== playerId);
  game.users = game.users.filter((id) => id !== playerId);
};

export const POSTupdateGameName = (gameId: number, newTitle: string): void => {
  const game = GETgameById(gameId);
  game.title = newTitle;
};

export const POSTpromoteUserToGameMaster = (userId: number, gameId: number): void => {
  const game = GETgameById(gameId);
  game.gms.push(userId);
};

export const POSTdemoteGameMasterToPlayer = (userId: number, gameId: number): void => {
  const game = GETgameById(gameId);
  game.gms = game.gms.filter((id) => id !== userId);
};

// Functions mocking backend behaviour:

export const GETnodeById = (id: number): Node => {
  return CloneDeep(globalNodes.filter((node) => node.id === id)[0]);
};

export const GETuserById = (id: number): User => {
  return CloneDeep(globalUsers.filter((user) => user.id === id)[0]);
};

export const GETsubnodesVisibleToUser = (nodeId: number, userId: number): Subnode[] => {
  const node = globalNodes.filter((node) => node.id === nodeId)[0] as Node;
  const allSubnodes = globalSubnodes.filter((subnode) => subnode.node_id === nodeId);
  let visibleSubodes;
  if (node.editors.includes(userId)) {
    visibleSubodes = allSubnodes;
  } else {
    visibleSubodes = allSubnodes.filter((subnode) => subnode.informationLevel <= node.informationLevels[userId]);
  }
  return CloneDeep(visibleSubodes);
};

export const POSTsubnodeContent = (id: number, newContent: Delta): void => {
  const subnode = globalSubnodes.filter((subnode) => subnode.id === id)[0];
  console.log(newContent);
  subnode.content = subnode.content.compose(newContent);
  // console.log(subnode.content.compose(newContent));
  console.log(subnode.content);
};

export const GETuserCanEditSubnode = (userId: number, subnodeId: number): boolean => {
  const subnode = globalSubnodes.filter((subnode) => subnode.id === subnodeId)[0];
  return CloneDeep(subnode.editors.includes(userId));
};

export const GETuserCanEditNode = (userId: number, nodeId: number): boolean => {
  const node = globalNodes.filter((node) => node.id === nodeId)[0];
  return CloneDeep(node.editors.includes(userId));
};

export const GETnodesInGame = (gameId: number): Node[] => {
  const game = globalGames.filter((game) => game.id === gameId)[0];
  const nodes = [];
  for (const nodeid of game.nodes) {
    nodes.push(globalNodes[nodeid - 1]);
  }
  return nodes;
};

export const GETeditorsForNode = (nodeId: number): User[] => {
  const node = globalNodes.filter((node) => node.id === nodeId)[0];
  const users = globalUsers.filter((user) => node.editors.includes(user.id));
  return CloneDeep(users);
};

export const GETplayersInGame = (gameId: number): User[] => {
  // const node = globalNodes.filter((node) => node.id === nodeId)[0];
  const game = globalGames.filter((game) => game.id === gameId)[0];
  const userIds = game.players;
  const users = globalUsers.filter((user) => userIds.includes(user.id));
  return CloneDeep(users);
};

export const GETuserIsGMInGame = (userId: number, gameId: number): boolean => {
  const game = globalGames.filter((game) => game.id === gameId)[0];
  return CloneDeep(game.gms.includes(userId));
};

export const GETgameById = (gameId: number): Game => {
  const game = globalGames.filter((game) => game.id === gameId)[0];
  return CloneDeep(game);
};

export const GETsubnodesByNodeId = (nodeId: number): Subnode[] => {
  return CloneDeep(globalSubnodes.filter((subnode) => subnode.node_id === nodeId));
};

export const POSTnode = (node: Node): void => {
  const existingNode = globalNodes.filter((n) => n.id === node.id)[0];
  const index = globalNodes.indexOf(existingNode);
  if (index !== -1) {
    globalNodes[index] = CloneDeep(node);
  }
  // FOR DEBUG:
  const newNode = globalNodes.filter((n) => n.id === node.id)[0] as Node;
  console.log('New value for node is:', newNode);
};

export const POSTuser = (user: User): void => {
  const existingUser = globalUsers.filter((u) => u.id === user.id)[0];
  const index = globalUsers.indexOf(existingUser);
  if (index !== -1) {
    globalUsers[index] = CloneDeep(user);
  }
  // FOR DEBUG:
  const newUser = globalUsers.filter((u) => u.id === user.id)[0] as User;
  console.log('New value for node is:', newUser);
};

export const POSTremoveGame = (id: number): void => {
  console.log('Removing game with ID ', id);
  console.log('Games before', globalGames);
  globalGames = globalGames.filter((game) => game.id !== id);
  console.log('Games after', globalGames);
};
