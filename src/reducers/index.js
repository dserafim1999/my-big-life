import { combineReducers } from 'redux-immutable';

import general from './general';
import tracks from './tracks';
import process from './process';
import map from './map';
import queries from './queries';

const app = combineReducers({
  tracks,
  general,
  process,
  map,
  queries
});

export default app;
