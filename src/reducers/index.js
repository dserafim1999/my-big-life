import { combineReducers } from 'redux-immutable';

import general from './general';
import tracks from './tracks';
import process from './process';
import map from './map';

const app = combineReducers({
  tracks: tracks,
  general,
  process,
  map
})

export default app;
