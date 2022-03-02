import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import { Map } from 'immutable';

import { requestServerState } from './actions/progress';
import { DEHIGHLIGHT_POINT, DEHIGHLIGHT_SEGMENT, HIGHLIGHT_POINT, HIGHLIGHT_SEGMENT } from './actions';

const actionsToNotLog = new Set([DEHIGHLIGHT_SEGMENT, HIGHLIGHT_SEGMENT, HIGHLIGHT_POINT, DEHIGHLIGHT_POINT]);

const loggerMiddleware = createLogger({
  stateTransformer: (state) => state.toJS(),
  predicate: (getState, action) => !actionsToNotLog.has(action.type)
});

let store = createStore(
  reducers,
  Map({}),
  process.env.NODE_ENV === 'development' ? applyMiddleware(thunk, loggerMiddleware) : applyMiddleware(thunkMiddleware)
);

export default store;