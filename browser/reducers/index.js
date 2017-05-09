// @flow

import { combineReducers } from 'redux';

import { user } from './user';
import { roomList } from './roomList';
import { room } from './room';
import { build } from './build';

export const reducers = combineReducers({
	user,
	room,
	roomList,
	build
});