// @flow

//actions
export const UPDATE_VALUE = 'MONEY_UPDATE_VALUE';
export const UPDATE_ALL = 'MONEY_UPDATE_ALL';

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
export const money = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_VALUE:
			return Object.assign({}, state, {[action.seat]: state[action.seat] + action.delta});
		case UPDATE_ALL: {
			const newState = Object.assign({}, state);
			// eslint-ignore-next-line no-console
			for (const i in newState) {
				newState[i] += action.delta;
			}
			return newState;
		}
		default:
			return state;
	}
};

//action creators
export const updateMoney = (seat, delta) => ({
	type: UPDATE_VALUE,
	seat,
	delta
});
export const updateAll = (delta) => ({
	type: UPDATE_ALL,
	delta
});
