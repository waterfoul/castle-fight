// @flow

import { createBuilding } from '../../common/gameState/buildings';

const seats = [
	'Red1',
	'Red2',
	'Red3',
	'Red4',
	'Blue1',
	'Blue2',
	'Blue3',
	'Blue4',
];

//actions
export const START_BUILD = 'START_BUILD';
export const SET_POSITION = 'BUILD_SET_POSITION';
export const CLEAR_BUILD = 'CLEAR_BUILD';

//reducer
export const build = (state = {}, action) => {
	switch (action.type) {
		case START_BUILD:
			return {
				type: action.buildingType,
				row: '',
				col: ''
			};
		case SET_POSITION:
			return {
				...state,
				row: action.row,
				col: action.col
			};
		case CLEAR_BUILD:
			return {};
		default:
			return state;
	}
};

//action creators
export const startBuild = (buildingType) => ({
	type: START_BUILD,
	buildingType
});
export const setPosition = (row, col) => ({
	type: SET_POSITION,
	row,
	col
});
const clearBuild = () => ({
	type: CLEAR_BUILD
});
export const finishBuild = () => ((dispatch, getState) => {
	const {room, build, user} = getState();
	let seat = null;

	// eslint-disable-next-line for-in
	for(const i in seats) {
		if(room[seats[i]] && room[seats[i]].id === user.id) {
			seat = seats[i];
			break;
		}
	}

	dispatch(clearBuild());
	if(seat) {
		dispatch(createBuilding(seat, build.type, build.row, build.col));
	}
});
