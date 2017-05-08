import axios from 'axios';
import { send } from '../socket';
import { gameStateReducer } from '../../common/gameState';

//actions
export const ROOM_RESULT = 'ROOM_RESULT';

//reducer
export const room = (state = null, action) => {
	switch (action.type) {
		case ROOM_RESULT:
			if (state && !action.forceGameState && action.roomData.id === state.id) {
				return Object.assign({}, action.roomData, {
					gameState: state.gameState
				});
			} else {
				return action.roomData;
			}
		default:
			if (state && state.gameState) {
				return Object.assign({}, state, { gameState: gameStateReducer(state.gameState, action) });
			} else {
				return state;
			}
	}
};

//action creators
export const result = (roomData, forceGameState) => ({
	type: ROOM_RESULT,
	roomData,
	forceGameState
});

//thunks
export const fetch = (id, forceGameState = false) => (
	(dispatch) =>
		axios.get(`/api/room/${id}`)
			.then((response) => {
				dispatch(result(response.data, forceGameState));
				send('connect');
			})
			.catch((e) => {
				// TODO: Display an error on the UI
				// eslint-disable-next-line no-console
				console.error('Error while loading rooms', e);
				dispatch(result(null));
			})
);

export const sit = (seat) => (
	(dispatch, getState) => {
		const { room: state } = getState();
		axios.post(`/api/room/${state.id}/sit/${seat}`)
			.then(() => {
				dispatch(fetch(state.id));
			})
			.catch((e) => {
				// TODO: Display an error on the UI
				// eslint-disable-next-line no-console
				console.error('Error while taking control', e);
			});
	}
);

export const start = () => (
	(dispatch, getState) => {
		const { room: state } = getState();
		axios.post(`/api/room/${state.id}/start`)
			.then(() => {
				dispatch(fetch(state.id));
			})
			.catch((e) => {
				// TODO: Display an error on the UI
				// eslint-disable-next-line no-console
				console.error('Error while starting', e);
			});
	}
);
