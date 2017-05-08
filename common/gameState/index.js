const { combineReducers } = require('redux');

const gameStateReducer = combineReducers({
	money: require('./money').money
});

module.exports = {
	gameStateReducer
};