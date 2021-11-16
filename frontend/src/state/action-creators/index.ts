import { Dispatch } from 'redux';
import { ActionType } from '../action-types';
import { Action } from '../actions/index';

export const addPlayer = (id: number) => {
  return (dispatch: Dispatch<Action>): void => {
    dispatch({
      type: ActionType.ADD_PLAYER,
      payload: id,
    });
  };
};
