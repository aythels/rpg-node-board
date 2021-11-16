import { Game } from '../../types';
import { ActionType } from '../action-types/index';

interface AddPlayerAction {
  type: ActionType.ADD_PLAYER;
  payload: number;
}

interface LoadGameAction {
  type: ActionType.GAME_LOADED;
  payload: Game;
}

export type Action = AddPlayerAction | LoadGameAction;
