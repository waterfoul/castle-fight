// @flow

const express = require('express');
const Room = require('../db/models/room');
const User = require('../db/models/user');
const { sendTo, sendAll } = require('../socket');
const { gameCache, commitGameCache } = require('../gameTick');

module.exports = (new express.Router('api/room'))
	.get('/', (req, res, next) => (
		Room.findAll({
			attributes: {
				exclude: ['password', 'gameState']
			},
			include: [
				{model: User, as: 'Red1'},
				{model: User, as: 'Red2'},
				{model: User, as: 'Red3'},
				{model: User, as: 'Red4'},
				{model: User, as: 'Blue1'},
				{model: User, as: 'Blue2'},
				{model: User, as: 'Blue3'},
				{model: User, as: 'Blue4'},
			],
			order: 'name'
		})
			.then((rooms) => {
				return rooms ? res.json(rooms) : res.sendStatus(404);
			})
			.catch(next)
	))
	.get('/:id', (req, res, next) => (
		commitGameCache().then(() =>
			Room.findById(
				req.params.id,
				{
					attributes: {
						exclude: ['password']
					},
					include: [
						{ model: User, as: 'Red1' },
						{ model: User, as: 'Red2' },
						{ model: User, as: 'Red3' },
						{ model: User, as: 'Red4' },
						{ model: User, as: 'Blue1' },
						{ model: User, as: 'Blue2' },
						{ model: User, as: 'Blue3' },
						{ model: User, as: 'Blue4' },
					]
				}
			)
		)
			.then((room) => {
				gameCache[room.id] = room;
				return (room ? res.json(room) : res.sendStatus(404));
			})
			.catch(next)
	))
	.post('/', (req, res, next) => {
		req.body.gameState = req.body.gameState || {};

		return Room.create(req.body)
			.then((room) => {
				gameCache[room.id] = room;
				res.json(room).status(201);

				sendAll(JSON.stringify({
					fullUpdate: true
				}));
			})
			.catch(next)
	})
	.post('/:id/sit/:seat', (req, res, next) => {
		const update = {};
		update[req.params.seat + 'Id'] = req.user.id;

		return commitGameCache().then(() =>
			Room.update(
				update,
				{where: {id: req.params.id}}
			)
		)
			.then((room) => {
				gameCache[room.id] = room;
				sendTo(room.id, JSON.stringify({
					room: room.id,
					update: true
				}));

				sendAll(JSON.stringify({
					fullUpdate: true
				}));
				res.sendStatus(204);
			})
			.catch(next);
	})
	.post('/:id/start', (req, res, next) => {

		return commitGameCache().then(() =>
			Room.update(
				{
					started: true
				},
				{where: {id: req.params.id}}
			)
		)
			.then((room) => {
				gameCache[room.id] = room;
				sendTo(room.id, JSON.stringify({
					room: room.id,
					update: true
				}));

				sendAll(JSON.stringify({
					fullUpdate: true
				}));
				res.sendStatus(204);
			})
			.catch(next);
	});
