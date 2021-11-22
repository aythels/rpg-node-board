import { combineReducers } from 'redux';
import gameReducer from './slices/gameSlice';
import userReducer from './slices/userSlice';

const rootReducer = combineReducers({
  game: gameReducer,
  user: userReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
