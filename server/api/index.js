// @flow

const express = require('express');
import { auth } from './auth';

module.exports = new express.Router('api')
	.use('/auth', auth)
	.use('/room', require('./room'))
	.use('/', (req, res, next) => {
		res.sendStatus(404);
	});
