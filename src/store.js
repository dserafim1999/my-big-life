import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import { Map } from 'immutable';

import { requestServerState } from './actions/progress';

const loggerMiddleware = createLogger({
  stateTransformer: (state) => state.toJS()
});

let store = createStore(
  reducers,
  Map({}),
  process.env.NODE_ENV === 'development' ? applyMiddleware(thunk, loggerMiddleware) : applyMiddleware(thunkMiddleware)
)

store.dispatch(requestServerState())

export default store;