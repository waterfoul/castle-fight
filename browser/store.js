import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { reducers } from './reducers';
import thunkMiddleware from 'redux-thunk';

import { BUILD } from '../common/gameState/buildings';
import { send } from './socket';

const socketInclude = [
  BUILD
];
const socketMiddleware = () => (next) => (action) => {
  const nextAction = next(action);

  if (!action.fromSocket && socketInclude.indexOf(action.type) !== -1) {
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
