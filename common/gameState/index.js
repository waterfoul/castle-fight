// @flow

import { combineReducers } from 'redux';
import { money } from './money';
import { buildings } from './buildings';

export const GAME_STATE_SYNC = 'GAME_STATE_SYNC';

const combined = combineReducers({
	money,
	buildings
});

export const gameStateReducer = (state = {}, action) => {
	switch (action.type) {
		case GAME_STATE_SYNC:
			return action.gameState;
		default:
			return combined(state, action);
	}
};

export const gameStateSync = (gameState) => ({
	type: GAME_STATE_SYNC,
	gameState
});
