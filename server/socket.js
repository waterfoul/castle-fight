// @flow

import sockjs from 'sockjs';
import { logger } from './utils/logger';
import { gameStateReducer, gameStateSync } from '../common/gameState';
import { BUILD } from '../common/gameState/buildings';
import { authKeys } from './api/auth';

export const gameCache = {};

// This holds the clients connected to each room
const rooms = {};

let allClients = [];

const allowedSeatActions = [
	BUILD
];

export const svr = sockjs.createServer({
	log: logger.log.bind(logger)
});

function removeFrom(client, room) {
	if (room !== -1) {
		rooms[room] = rooms[room] || [];
		rooms[room] = rooms[room].filter((ele) => ele !== client);
	}
}

export function sendTo(roomNum, message, excludedClient) {
	if (rooms[roomNum]) {
		rooms[roomNum].forEach((client) => {
			if (client !== excludedClient) {
				client.write(message);
			}
		});
	}
}

export function sendAll(message) {
	logger.info('Broadcasting message to all clients', { message });
	allClients.forEach((client) => client.write(message));
}

svr.on('connection', function(conn) {
	let roomNum = -1;
	let user = null;
	allClients.push(conn);
	// parseCookie(svr.upgradeReq, null, function(err) {
	// 	var sessionID = svr.upgradeReq.cookies['sid'];
	// 	store.get(sessionID, function(err, session) {
	// 		console.log('session', session)
	// 	});
	// });

	conn.on('data', function(message) {
		const data = JSON.parse(message);

		if (data.body === 'connect') {
			removeFrom(conn, roomNum);

			roomNum = data.room;

			rooms[roomNum] = rooms[roomNum] || [];
			rooms[roomNum].push(conn);

			conn.write(JSON.stringify({
				room: data.room,
				body: gameStateSync(gameCache[data.room].gameState)
			}))
		} if(data.body.action === 'authenticate') {
			user = authKeys[data.body.authKey];
			delete authKeys[data.body.authKey];
		} else if (roomNum === data.room) {
			rooms[roomNum] = rooms[roomNum] || [];

			if (allowedSeatActions.indexOf(data.body.type) !== -1) {
				const game = gameCache[data.room];
				if(game[data.body.seat].id === user.id) {
					game.gameState = gameStateReducer(game.gameState, data.body);
				}
			}
		}
	});

	conn.on('close', function() {
		removeFrom(conn, roomNum);
		allClients = allClients.filter((ele) => ele !== conn);
	});
});
