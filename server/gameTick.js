// @flow

import Room from './db/models/room';
import { logger } from './utils/logger';
import { gameStateReducer, gameStateSync } from '../common/gameState';
import { updateAll } from '../common/gameState/money';
import { spawnUnits, moveUnits } from '../common/gameState/units';
import { sendTo, gameCache } from './socket';

const roadRows = [4, 5, 10, 11];
const boardWidth = 46;

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

function getRoadDistance(unit) {
	return roadRows
		.map((v) => v - unit.row)
		.reduce((acc, val) => Math.abs(acc) < Math.abs(val) ? acc : val, 999);
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
				if(gameCache[i].gameState.units) {
					const units = gameCache[i].gameState.units;
					// This will hold the order in which the units get calculated
					// higher weight = calculated later
					const order = units.map((u, i) => {
						let weight = 0;
						if(roadRows.indexOf(u.row) === -1) {
							// Not on the road, calc in the last group
							weight += 9000;
							// Add the distance from the road, the closer to the road the sooner it gets calculated
							weight += Math.abs(getRoadDistance(u));
						} else if (u.seat.substr(0, 3) === 'Red') {
							// Weight these based on distance from the far edge, the closer to the back the later the calc
							weight += boardWidth - u.row
						} else {
							// Weight these based on distance from the far edge, the closer to the back the later the calc
							weight += u.row;
						}
						return {i, weight}
					});
					order.sort((a, b) => {
						if(a.weight < b.weight) {
							return -1;
						} else if(a.weight > b.weight) {
							return 1;
						} else if(a.i < b.i) {
							return -1;
						} else {
							return 1;
						}
					});
					// This will eventually hold the actual destinations
					const movements = units.map(() => []);

					order.forEach((o) => {
						const unit = units[o.i];
						let dest = [];

						if (roadRows.indexOf(unit.row) === -1) {
							const dist = roadRows
								.map((v) => v - unit.row)
								.reduce((acc, val) => Math.abs(acc) < Math.abs(val) ? acc : val, 999);
							dest = [unit.row + (dist / Math.abs(dist)), unit.col];
						} else if (unit.seat.substr(0, 3) === 'Red') {
							dest = [unit.row, unit.col + 1];
						} else {
							dest = [unit.row, unit.col - 1];
						}

						if(movements.find((ele) => ele[0] === dest[0] && ele[1] === dest[1])) {
							// Something's already there
							dest = [unit.row, unit.col]
						}
						if(units.find((ele) => ele.seat.substr(0, 3) !== unit.seat.substr(0, 3) && ele.row === dest[0] && ele.col === dest[1])) {
							// Don't pass enemy units
							dest = [unit.row, unit.col]
						}

						movements[o.i] = dest;
					});

					sendEvent(i, moveUnits(movements));
				}
			}
			// Every 5 seconds
			if(tickCount % 50 === 0) {
				if(gameCache[i].gameState.buildings) {
					const units = gameCache[i].gameState.units || [];
					sendEvent(i, spawnUnits(gameCache[i].gameState.buildings.filter((build) => {
						return !units.find((unit) => unit.row === build.row && unit.col === build.col);
					})));
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
