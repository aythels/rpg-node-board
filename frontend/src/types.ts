import Delta from 'quill-delta';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
export interface InfoLevel {
  userId: User['_id'];
  infoLevel: number;
}
export interface Node {
  id: number; // TODO: replace once we start working with Mongo _id's
  name: string;
  image: any;
  thumbnailImage?: any; // TODO: make required
  imageAlt: string;
  subnodes: Subnode[];
  informationLevels: InfoLevel[];
  editors: User['_id'][];
  type: string;
}
export interface Subnode {
  id: number;
  name: string;
  informationLevel: number;
  editors: User['_id'][];
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
  userId: User['_id'];
  permission: UserPermission;
}
export interface Game {
  _id: string;
  title: string;
  imgpath?: string; //TODO: actually handle images
  image?: any;
  nodes: Node[];
  users: UserPermissionRecord[];
  settings: { [key: string]: unknown };
}
export interface User {
  _id: string;
  username: string;
  password: string; // FOR NOW
  email: string; // FOR NOW
  games: Game['_id'][];
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
