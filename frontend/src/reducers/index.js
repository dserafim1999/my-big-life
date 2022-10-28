import { combineReducers } from 'redux-immutable';

import general from './general';
import tracks from './tracks';
import process from './process';
import map from './map';
import queries from './queries';
import trips from './trips';

const app = combineReducers({
  tracks,
  general,
  process,
  map,
  queries,
  trips
});

export default app;
