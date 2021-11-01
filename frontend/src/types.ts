import Delta from 'quill-delta';

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

// Interfaces go here:

export interface Node {
  id: number;
  name: string;
  image: string;
  imageAlt: string;
  subnodes: number[];
  informationLevels: { [userid: number]: number };
  editors: number[];
  type: string;
}

export interface Subnode {
  id: number;
  name: string;
  informationLevel: number;
  editors: number[];
  type: string;
  content: Delta;
}

export interface Game {
  id: number;
  nodes: number[];
  title: string;
  players: number[];
  gms: number[];
  users: number[]; // = players + gms, might be a better way to define this
  settings: Record<string, unknown>;
}

export interface User {
  id: number;
  username: string;
  password: string; // FOR NOW
  email: string; // FOR NOW
  games: number[];
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
