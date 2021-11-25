import { combineReducers } from 'redux';
import gameReducer from './slices/gameSlice';
import userReducer from './slices/userSlice';
import nodeviewReducer from './slices/nodeviewSlice';

const rootReducer = combineReducers({
  game: gameReducer,
  user: userReducer,
  nodeview: nodeviewReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
