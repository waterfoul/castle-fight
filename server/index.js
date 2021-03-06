// @flow

import { logger } from './utils/logger';
import express from 'express';
import http from 'http';
import expressWinston from 'express-winston';
import winston from 'winston';
import passport from 'passport';
import bodyParser from 'body-parser';
import { resolve } from 'path';
import args from './utils/args';
import db from './db';
import { svr } from './socket';

const app = express()

	.use(expressWinston.logger({
		transports: [
			new winston.transports.Console({
				prettyPrint: true,
				colorize: true,
				timestamp: true,
				level: args.verbose >= 1 ? 'info' : 'warn'
			})
		],
		meta: false, // optional: control whether you want to log the meta data about the request (default to true)
		expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
		colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX
	}))

	.use(require('cookie-session')({
		name: 'session',
		keys: [process.env.SESSION_SECRET || 'an insecure secret key']
	}))

	// Body parsing middleware
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())

	// Authentication middleware
	.use(passport.initialize())
	.use(passport.session())

	.use('/static', express.static(resolve(__dirname, '..', 'browser', 'static')))
	.use('/fonts/', express.static(resolve(__dirname, '..', 'node_modules', 'bootstrap-sass', 'assets', 'fonts', 'bootstrap')))

	.use('/api', require('./api'))

	.get('/*', (_, res) => res.sendFile(resolve(__dirname, '..', 'browser', 'index.html')))

	.use((err, req, res, next) => {
		res.sendStatus(500);
		logger.error(err);
	});

db.didSync.then(() => {
	const server = http.createServer(app);
	svr.installHandlers(server, { prefix: '/socket' });
	server.listen(args.port, () => {
		const { address, port } = server.address();
		const host = address === '::' ? 'localhost' : address;
		const urlSafeHost = host.includes(':') ? `[${host}]` : host;
		logger.info(`Listening on http://${urlSafeHost}:${port}`);
	});
}).catch((e) => logger.error('Failed to start server', e));