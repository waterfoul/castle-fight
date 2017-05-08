import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducers } from './reducers';
import thunkMiddleware from 'redux-thunk';

import { ROOM_RESULT } from './reducers/room';
import { AUTHENTICATED } from './reducers/user';
import { ROOM_LIST } from './reducers/roomList';
import { send } from './socket';

const socketExclude = [
  ROOM_RESULT,
  AUTHENTICATED,
  ROOM_LIST
];
const socketMiddleware = () => (next) => (action) => {
  const nextAction = next(action);

  if (!action.fromSocket && socketExclude.indexOf(action.type) === -1) {
    send(action);
  }

  return nextAction;
};

export const store = createStore(
  reducers,
  composeWithDevTools(
    applyMiddleware(
      thunkMiddleware,
      socketMiddleware
    )
  )
);
