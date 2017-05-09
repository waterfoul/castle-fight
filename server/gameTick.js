// @flow
"use strict";

import Room from './db/models/room';
import { logger } from './utils/logger';
import { gameStateReducer, gameStateSync } from '../common/gameState';
import { updateAll } from '../common/gameState/money';
import { sendTo, gameCache } from './socket';

function sendEvent(idx, action) {
	gameCache[idx].gameState = gameStateReducer(gameCache[idx].gameState, action);
	sendTo(idx, JSON.stringify({room: idx, body: action}));
}

let commitPromise = Promise.resolve();

export function commitGameCache(): Promise<any> {
	return commitPromise.then(() => {
		const promises = [];
		// eslint-ignore-next-line for-in
		for(const i in gameCache) {
			promises.push(gameCache[i].save().then(() => {
				sendEvent(i, gameStateSync(gameCache[i].gameState));
			}));
		}
		commitPromise = Promise.all(promises);
		return commitPromise;
	});
}

let tickCount = 0;
export function gameTick() {
	tickCount++;
	// eslint-ignore-next-line for-in
	for(const i in gameCache) {
		if(gameCache[i].started) {
			// Every second
			if(tickCount % 10 === 0) {
				sendEvent(i, updateAll(10));
			}
		}
	}

	// Reset the tick count every 10s and commit the cache
	if(tickCount >= 100) {
		tickCount = 0;
		commitGameCache().catch(logger.error.bind(logger));
	}
	setTimeout(gameTick, 100);
}

Room.findAll({
	attributes: {
		exclude: ['password']
	},
	order: 'name'
}).then((rooms) => {
	// eslint-ignore-next-line for-in
	for (const i in rooms) {
		gameCache[rooms[i].id] = rooms[i];
	}
});
