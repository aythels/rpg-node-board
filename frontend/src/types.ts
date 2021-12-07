import Delta from 'quill-delta';

export interface InfoLevel {
  user: User['_id'];
  infoLevel: number;
}
export interface Node {
  _id: string;
  name: string;
  image?: string;
  thumbnailImage?: any;
  imageAlt: string;
  subnodes: Subnode[];
  informationLevels: InfoLevel[];
  editors: User['_id'][];
  type: string;
  x: number;
  y: number;
}
export interface Subnode {
  _id: string;
  name: string;
  informationLevel: number;
  editors: User['_id'][];
  type: string;
  content: Delta | string; // string for JSON
}
export enum UserPermission {
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
  image?: string;
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
  profilePicture?: string;
  images: string[]; // FOR NOW
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
