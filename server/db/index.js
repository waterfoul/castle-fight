'use strict';
const debugSQL = require('debug')('sql'); // DEBUG=sql
const chalk = require('chalk');
const Sequelize = require('sequelize');
import { logger } from '../utils/logger';

const name = (process.env.DATABASE_NAME || 'castle-fight');

const url = process.env.DATABASE_URL || `postgres://localhost:5432/${name}`;

logger.info(chalk.yellow(`Opening database connection to ${url}`));

// create the database instance
const db = module.exports = new Sequelize(url, {
	logging: logger.debug.bind(logger)
});

// pull in our models
require('./models');

// sync the db, creating it if necessary
function sync(force = false, retries = 0, maxRetries = 5) {
	return db.sync({
		force,
		logging: logger.debug.bind(logger)
	})
		.then(() => logger.info(`Synced models to db ${url}`))
		.catch((fail) => {
			// Don't do this auto-create nonsense if we've retried too many times.
			if (retries > maxRetries) {
				logger.error(chalk.red(`********** database error ***********`));
				logger.error(chalk.red(`    Couldn't connect to ${url}`));
				logger.error();
				logger.error(chalk.red(fail));
				logger.error(chalk.red(`*************************************`));
				return;
			}
			// Otherwise, do this autocreate nonsense
			logger.info(`${retries ? `[retry ${retries}]` : ''} Creating database ${name}...`);
			return new Promise((resolve, reject) =>
				// 'child_process.exec' docs: https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
				require('child_process').exec(`createdb "${name}"`, (err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				})
			).then(() => sync(true, retries + 1));
		});
}

// Note that db.didSync is a promise, rather than returning a promise
db.didSync = sync();