import Delta from 'quill-delta';
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
export interface InfoLevel {
  userId: User['_id'];
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
  editors: User['_id'][];
  type: string;
}
export interface Subnode {
  _id: String;
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
