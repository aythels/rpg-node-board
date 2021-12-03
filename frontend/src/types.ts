import Delta from 'quill-delta';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

export interface InfoLevel {
  userId: string;
  infoLevel: number;
}

export interface Node {
  _id: string;
  name: string;
  image?: any;
  thumbnailImage?: any;
  imageAlt: string;
  subnodes: Subnode[];
  informationLevels: InfoLevel[];
  editors: number[];
  type: string;
}

export interface Subnode {
  _id: string;
  name: string;
  informationLevel: number;
  editors: number[];
  type: string;
  content: Delta;
}

export enum UserPermission {
  // TODO: make types uppercase
  // owner,
  gameMaster,
  player,
}

export interface UserPermissionRecord {
  userId: number;
  permission: UserPermission;
}

export interface Game {
  _id: string;
  title: string;
  image?: any;
  nodes: Node[];
  users: UserPermissionRecord[];
  settings: Record<string, unknown>;
}

export interface User {
  _id: string;
  username: string;
  password: string; // FOR NOW
  email: string; // FOR NOW
  games: number[];
  profilePicture?: any;
  images: any[]; // FOR NOW
}

export enum DefaultNodeTypes {
  location,
  organization,
  item,
  person,
}

export enum DefaultSubnodeTypes {
  description,
  notes,
  event,
  linkList,
}
