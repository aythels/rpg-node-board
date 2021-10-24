/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

// Interfaces go here:

export interface Node {
  id: number;
  name: string;
  image: string;
  subnodes: number[];
  // access_level: number;
  editors: number[];
  type: string;
}

export interface Subnode {
  id: number;
  // access_level: number;
  editors: number[];
  type: string;
  content: string;
}

export interface Game {
  nodes: number[];
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
