const Sequelize = require('sequelize');
const db = require('../index.js');

const Room = db.define('room', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			notEmpty: true
		}
	},
	password: {
		type: Sequelize.STRING
	},
	started: {
		type: Sequelize.BOOLEAN,
        default: false
	},
	gameState: {
		type: Sequelize.JSON,
		default: {}
	}
});

module.exports = Room;