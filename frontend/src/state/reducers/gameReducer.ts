import { Dispatch } from 'redux';
import { GETgameById } from '../../mock-backend';
import { Game } from '../../types';
import { ActionType } from '../action-types/index';
import { Action } from '../actions';

// TODO: this hack ok?
const initialState: Game = {} as Game;

// TODO: clean up using immer
const reducer = (state: Game = initialState, action: Action): Game => {
  switch (action.type) {
    case ActionType.ADD_PLAYER:
      const newState: Game = {
        ...state,
        players: [...state.players, action.payload],
        users: [...state.users, action.payload],
      };
      return newState;
    case ActionType.GAME_LOADED:
      return action.payload;
    default:
      return state;
  }
};

// ((dispatch: Dispatch<Action>) => Promise<void>)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchGame = (gameId: number): any => {
  const fetchGame = async (dispatch: Dispatch<Action>): Promise<void> => {
    const game = GETgameById(gameId);
    dispatch({ type: ActionType.GAME_LOADED, payload: game });
  };
  return fetchGame;
};

export default reducer;
