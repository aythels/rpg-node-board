import { Dispatch } from 'redux';
import { GETgameById } from '../../mock-backend';
import { Game } from '../../types';
import { ActionType } from '../action-types/index';
import { Action } from '../actions';

const initialState: Game | null = null;

const reducer = (state: Game | null = initialState, action: Action): Game | null => {
  switch (action.type) {
    case ActionType.ADD_PLAYER:
      // TODO: clean up using the tool that allows in-place editing
      if (!state) {
        return initialState;
      }
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
