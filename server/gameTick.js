// @flow
"use strict";

import Room from './db/models/room';
import { logger } from './utils/logger';
import { gameStateReducer, gameStateSync } from '../common/gameState';
import { updateAll } from '../common/gameState/money';
import { spawnUnits, moveUnits } from '../common/gameState/units';
import { sendTo, gameCache } from './socket';

const roadRows = [4, 5, 10, 11];

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
function gameTick() {
	tickCount++;
	// eslint-ignore-next-line for-in
	for(const i in gameCache) {
		// TODO: For some reason this runs 2x figure out why
		if(gameCache[i].started) {
			// Every second
			if(tickCount % 10 === 0) {
				sendEvent(i, updateAll(10));
				// TODO: Batch these
				if(gameCache[i].gameState.units) {

					sendEvent(i, moveUnits(gameCache[i].gameState.units.map((u) => {
						if (roadRows.indexOf(u.row) === -1) {
							const dist = roadRows
								.map((v) => v - u.row)
								.reduce((acc, val) => Math.abs(acc) < Math.abs(val) ? acc : val, 999);
							return [u.row + (dist / Math.abs(dist)), u.col];
						} else if (u.seat.substr(0, 3) === 'Red') {
							return [u.row, u.col + 1];
						} else {
							return [u.row, u.col - 1];
						}
					})));
				}
			}
			// Every 5 seconds
			if(tickCount % 50 === 0) {
				if(gameCache[i].gameState.buildings) {
					sendEvent(i, spawnUnits(gameCache[i].gameState.buildings));
				}
			}
		}
	}

	// Every 10s
	if(tickCount >= 100) {
		// Reset the tick count
		tickCount = 0;
		// commit the cache
		commitGameCache().catch(logger.error.bind(logger));
	}
}

setInterval(gameTick, 100);

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
