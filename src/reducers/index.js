import { combineReducers } from 'redux-immutable';

import ui from './ui';
import tracks from './tracks';
import process from './process';
import map from './map';

const app = combineReducers({
  tracks: tracks,
  ui,
  process,
  map
})

export default app;
