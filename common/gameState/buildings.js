// @flow

//actions
export const BUILD = 'BUILD';

//reducer
export const buildings = (state = [], action) => {
	switch (action.type) {
		case BUILD:
			return [
				...state,
				{
					seat: action.seat,
					type: action.buildingType,
					row: action.row,
					col: action.col
				}
			];
		default:
			return state;
	}
};

//action creators
export const createBuilding = (seat, buildingType, row, col) => ({
	type: BUILD,
	seat,
	buildingType,
	row,
	col
});