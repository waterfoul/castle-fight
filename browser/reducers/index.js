import { combineReducers } from 'redux';

import { user } from './user';
import { roomList } from './roomList';
import { room } from './room';

export const reducers = combineReducers({
  user,
  room,
  roomList
});