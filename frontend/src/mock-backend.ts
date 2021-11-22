/* eslint-disable sort-imports */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import Delta from 'quill-delta';
import { Node, Subnode, Game, User, UserPermission, UserPermissionRecord } from './types';
import cloneDeep from 'lodash.clonedeep';

const theSoaringSkies = {
  id: 1,
  name: 'The Soaring Skies',
  image: '/images/sky.jpg',
  imageAlt: '',
  informationLevels: [
    { userId: 1, infoLevel: 0 },
    { userId: 3, infoLevel: 1 },
    { userId: 4, infoLevel: 1 },
    { userId: 5, infoLevel: 2 },
  ],
  subnodes: [
    {
      id: 1,
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
      informationLevel: 2,
      editors: [2],
      type: 'event',
      name: 'Sky is Falling',
      content: new Delta({ ops: [{ insert: 'The sky is falling!' }] }),
    },
    {
      id: 3,
      informationLevel: 1,
      editors: [1, 2, 3, 4, 5],
      type: 'notes',
      name: 'Notes',
      content: new Delta({ ops: [{ insert: 'wow sure looks cool!' }] }),
    },
  ],
  editors: [2, 1],
  type: 'location',
};

const museum = {
  id: 2,
  name: 'Museum',
  image: '/images/museum.jpg',
  imageAlt: '',
  informationLevels: [
    { userId: 1, infoLevel: 0 },
    { userId: 3, infoLevel: 1 },
    { userId: 4, infoLevel: 0 },
    { userId: 5, infoLevel: 2 },
  ],
  subnodes: [
    {
      id: 4,
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
  ],
  editors: [2],
  type: 'location',
};

const lonelyPath = {
  id: 3,
  name: 'Lonely Path',
  image: '/images/path.jpg',
  imageAlt: '',
  informationLevels: [
    { userId: 1, infoLevel: 0 },
    { userId: 3, infoLevel: 1 },
    { userId: 4, infoLevel: 1 },
    { userId: 5, infoLevel: 2 },
  ],
  subnodes: [
    {
      id: 5,
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
  ],
  editors: [2],
  type: 'location',
};

const stGeorge = {
  id: 4,
  name: 'St. George',
  image: '/images/stgeorge.jpg',
  imageAlt: '',
  informationLevels: [
    { userId: 1, infoLevel: 0 },
    { userId: 3, infoLevel: 0 },
    { userId: 4, infoLevel: 1 },
    { userId: 5, infoLevel: 2 },
  ],
  subnodes: [
    {
      id: 6,
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
  ],
  editors: [2],
  type: 'location',
};

const globalUsers: User[] = [
  {
    id: 1,
    username: 'user',
    password: 'user',
    email: 'user@user.com',
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
    games: [1, 2],
    images: ['/images/stgeorge.jpg', '/images/path.jpg', '/images/museum.jpg', '/images/sky.jpg'],
    profilePicture: '/images/profile_picture_2.png',
  },
  {
    id: 4,
    username: 'user3',
    password: 'user3',
    email: 'user3@user.com',
    games: [1, 2],
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
    nodes: [theSoaringSkies, museum, lonelyPath, stGeorge],
    users: [
      {
        userId: 1,
        permission: UserPermission.player,
      },
      {
        userId: 2,
        permission: UserPermission.gameMaster,
      },
      {
        userId: 3,
        permission: UserPermission.player,
      },
      {
        userId: 4,
        permission: UserPermission.player,
      },
      {
        userId: 5,
        permission: UserPermission.player,
      },
      {
        userId: 6,
        permission: UserPermission.player,
      },
      {
        userId: 7,
        permission: UserPermission.player,
      },
      {
        userId: 8,
        permission: UserPermission.player,
      },
      {
        userId: 9,
        permission: UserPermission.player,
      },
      {
        userId: 10,
        permission: UserPermission.player,
      },
      {
        userId: 11,
        permission: UserPermission.player,
      },
      {
        userId: 12,
        permission: UserPermission.player,
      },
    ],
    title: 'A Game!',
    imgpath: '/uoft.png',
    settings: {},
  },
  {
    id: 2,
    nodes: [theSoaringSkies, lonelyPath],
    users: [
      {
        userId: 3,
        permission: UserPermission.gameMaster,
      },
      {
        userId: 4,
        permission: UserPermission.gameMaster,
      },
    ],
    title: 'Filler game 1',
    imgpath: '/ryerson.jpg',
    settings: {},
  },
];

/* GAME FUNCTIONS */

/* GET */

export const GETgameById = (gameId: number): Game => {
  const globalGamesCopy = cloneDeep(globalGames);
  return globalGamesCopy.find((game) => game.id === gameId) as Game;
};

export const GETplayers = (gameId: number): User[] => {
  const game = GETgameById(gameId);
  return game
    ? game.users.filter((user) => user.permission === UserPermission.player).map((u) => GETuserById(u.userId))
    : [];
};

export const GETgms = (gameId: number): User[] => {
  const game = GETgameById(gameId);
  return game
    ? game.users.filter((user) => user.permission === UserPermission.gameMaster).map((u) => GETuserById(u.userId))
    : [];
};

export const GETgmIds = (gameId: number): number[] => {
  const gms = GETgms(gameId);
  return gms.map((gm) => gm.id);
};

/* POST */

export const POSTnode = (node: Node, gameId: number): void => {
  const game = globalGames.find((game) => game.id === gameId) as Game;
  game.nodes.push(node);
};

/* PATCH */

export const PATCHaddPlayerToGame = (playerId: number, gameId: number): void => {
  const game = globalGames.find((game) => game.id === gameId) as Game;
  const player = globalUsers.find((user) => user.id === playerId) as User;
  game.users.push({
    userId: player.id,
    permission: UserPermission.player,
  });
  player.games.push(game.id);
  for (const node of game.nodes) {
    node.informationLevels.push({
      userId: playerId,
      infoLevel: 0,
    });
  }
};

export const PATCHpromoteUserToGameMaster = (userId: number, gameId: number): void => {
  const game = globalGames.filter((game) => game.id === gameId)[0];
  const userPermissionRecord = game.users.find((u) => u.userId === userId) as UserPermissionRecord;
  userPermissionRecord.permission = UserPermission.gameMaster;
  for (const node of game.nodes) {
    if (!node.editors.includes(userId)) {
      node.editors.push(userId);
    }
  }
};

export const PATCHdemoteGameMasterToPlayer = (userId: number, gameId: number): void => {
  const game = globalGames.filter((game) => game.id === gameId)[0];
  const userPermissionRecord = game.users.find((u) => u.userId === userId) as UserPermissionRecord;
  userPermissionRecord.permission = UserPermission.player;
  for (const node of game.nodes) {
    // NOTE: this may not be ideal in all cases
    node.editors.filter((id) => id !== userId);
  }
};

export const PATCHgameName = (gameId: number, newTitle: string): void => {
  const game = globalGames.find((game) => game.id === gameId) as Game;
  game.title = newTitle;
};

/* DELETE */

export const DELETEplayerFromGame = (playerId: number, gameId: number): void => {
  const game = globalGames.find((game) => game.id === gameId) as Game;
  const player = globalUsers.find((user) => user.id === playerId) as User;
  game.users.filter((u) => u.userId !== player.id);
  player.games.filter((g) => g !== game.id);
  for (const node of game.nodes) {
    node.informationLevels.filter((i) => i.userId !== playerId);
  }
};

export const DELETEnodeFromGame = (gameId: number, nodeId: number): void => {
  const game = globalGames.find((game) => game.id === gameId) as Game;
  game.nodes.filter((node) => node.id !== nodeId);
};

export const DELETEGame = (gameId: number): void => {
  globalGames = globalGames.filter((game) => game.id !== gameId);
  for (const user of globalUsers) {
    user.games = user.games.filter((id) => id !== gameId);
  }
};

// USER FUNCTIONS:

/* GET */

export const GETuserById = (id: number): User => {
  const globalUsersCopy = cloneDeep(globalUsers);
  return globalUsersCopy.find((user) => user.id === id) as User;
};

export const GETuserByUsername = (username: string): User => {
  const globalUsersCopy = cloneDeep(globalUsers);
  return globalUsersCopy.find((user) => user.username == username) as User;
};

// This mock-db method will CERTAINLY be changed.
export const GETloginVerification = (username: string, password: string): boolean => {
  const globalUsersCopy = cloneDeep(globalUsers);
  return globalUsersCopy.filter((user) => user.username === username && user.password === password).length == 1;
};

export const GETuserIsGMInGame = (userId: number, gameId: number): boolean => {
  const game = GETgameById(gameId);
  const userPermissionRecord = game.users.find((u) => u.userId === userId) as UserPermissionRecord;
  return userPermissionRecord.permission === UserPermission.gameMaster;
};

export const GETgamesByUserID = (userID: number): Game[] => {
  const user = GETuserById(userID);
  return user.games.map((gameId) => GETgameById(gameId));
};

/* POST */

/* PATCH & PUT */

export const PUTuser = (user: User): void => {
  const existingUser = globalUsers.find((u) => u.id === user.id) as User;
  const index = globalUsers.indexOf(existingUser);
  if (index !== -1) {
    globalUsers[index] = cloneDeep(user);
  }
};

// export const GETuserCanEditSubnode = (userId: number, subnodeId: number): boolean => {
//   const subnode = globalSubnodes.filter((subnode) => subnode.id === subnodeId)[0];
//   return CloneDeep(subnode.editors.includes(userId));
// };

// export const GETuserCanEditNode = (userId: number, nodeId: number): boolean => {
//   const node = globalNodes.filter((node) => node.id === nodeId)[0];
//   return CloneDeep(node.editors.includes(userId));
// };

// export const GETnodesInGame = (gameId: number): Node[] => {
//   const game = globalGames.filter((game) => game.id === gameId)[0];
//   return globalNodes.filter((node) => game.nodes.includes(node.id));
// };

// export const GETnodesInGameVisibleToUser = (gameId: number, userId: number): Node[] => {
//   const allNodes = GETnodesInGame(gameId);
//   const nodes = allNodes.filter((node) => {
//     if (node.editors.includes(userId)) {
//       return true;
//     } else if (node.informationLevels[userId]) {
//       return node.informationLevels[userId] > 0;
//     } else {
//       return false;
//     }
//   });
//   return nodes;
// };

// let NEXT_SUBNODE = globalSubnodes.length;
// let NEXT_NODE = globalNodes.length;

// export const GETnewSubnodeId = (): number => {
//   NEXT_SUBNODE += 1;
//   return NEXT_SUBNODE;
// };

// export const GETnewNodeId = (): number => {
//   NEXT_NODE += 1;
//   return NEXT_NODE;
// };

// export const GETeditorsForNode = (nodeId: number): User[] => {
//   const node = globalNodes.filter((node) => node.id === nodeId)[0];
//   const users = globalUsers.filter((user) => node.editors.includes(user.id));
//   return CloneDeep(users);
// };

// export const GETsubnodesByNodeId = (nodeId: number): Subnode[] => {
//   return CloneDeep(globalSubnodes.filter((subnode) => subnode.node_id === nodeId));
// };
