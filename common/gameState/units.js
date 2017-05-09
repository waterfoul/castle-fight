// @flow

//actions
export const SPAWN = 'SPAWN';
export const SPAWN_MULTI = 'SPAWN_MULTI';
export const MOVE = 'MOVE';
export const MOVE_MULTI = 'MOVE_MULTI';

//reducer
export const units = (state = [], action) => {
	switch (action.type) {
		case SPAWN:
			return [
				...state,
				{
					seat: action.seat,
					type: action.unitType,
					row: action.row,
					col: action.col
				}
			];
		case SPAWN_MULTI:
			return [
				...state,
				...action.units
			];
		case MOVE: {
			const newState = [...state];
			newState[action.idx].row = action.row;
			newState[action.idx].col = action.col;
			return newState;
		}
		case MOVE_MULTI:
			return state.map((ele, i) => {
				return ({
					...ele,
					row: action.movements[i] ? action.movements[i][0] : ele.row,
					col: action.movements[i] ? action.movements[i][1] : ele.col
				})
			});
		default:
			return state;
	}
};

//action creators
export const spawnUnit = (seat, unitType, row, col) => ({
	type: SPAWN,
	seat,
	unitType,
	row,
	col
});
export const spawnUnits = (units) => ({
	type: SPAWN_MULTI,
	units
});
export const moveUnit = (idx, row, col) => ({
	type: MOVE,
	idx,
	row,
	col
});
export const moveUnits = (movements) => ({
	type: MOVE_MULTI,
	movements
});