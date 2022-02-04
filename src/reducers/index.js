import { combineReducers } from 'redux';

import ui from './ui'
import tracks from './tracks'

const app = combineReducers({
  tracks,
  ui
})

export default app
