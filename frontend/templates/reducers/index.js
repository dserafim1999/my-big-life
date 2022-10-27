import { combineReducers } from 'redux-immutable';

import example from './example';

/**
 * To add a new reducer file, you must append it to the already existing parameters of the combineReducers function
 */
const app = combineReducers({
  example
});

export default app;
