import axios from 'axios';

//actions
export const UPDATE_VALUE = 'MONEY_UPDATE_VALUE';

const initialState = {
	Red1: 100,
	Red2: 100,
	Red3: 100,
	Red4: 100,
	Blue1: 100,
	Blue2: 100,
	Blue3: 100,
	Blue4: 100
};

//reducer
const money = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_VALUE:
			return Object.assign({}, state, {[action.seat]: newValue});
		default:
			return state;
	}
};

//action creators
const updateMoney = (seat, newValue) => ({
	type: UPDATE_VALUE,
	seat,
	newValue
});

module.exports = {
	money,
	updateMoney
};
