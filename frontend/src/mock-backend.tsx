/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */

// Note: it may be better to user Array<number> for most things as they will just be IDs

interface Node {
  id: number;
  name: string;
  image: string;
  subnodes: Array<Subnode>;
  // access_level: number;
  editors: Array<User>;
  type: string;
}

interface Subnode {
  id: number;
  // access_level: number;
  editors: Array<User>;
  type: string;
  content: unknown;
}

interface Game {
  nodes: Array<Node>;
  players: Array<User>;
  gms: Array<User>;
  users: Array<User>; // = players + gms, might be a better way to define this
  settings: Record<string, unknown>;
}

interface User {
  username: string;
  password: string; // FOR NOW
  email: string; // FOR NOW
  games: Array<Game>;
}

const nodes = [
  {
    id: 1,
    name: 'The Soaring Skies',
    image: '',
    subnodes: [],
    editors: [],
    type: 'location',
  },
];

// Functions mocking backend behaviour go here:

const GET_node_by_id = (id: number): Node => {
  return nodes.filter((node) => {
    node.id == id;
  })[0];
};

export { GET_node_by_id };
