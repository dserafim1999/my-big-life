import { combineReducers } from 'redux';
import { getSegmentById } from '../utils';

const tracks = (state = [], action) => {
  switch (action.type) {
    case 'track/add':
      return [...state, action.track];
    case 'segment/visibility':
      let nextState = [...state];
      let segment = getSegmentById(action.segmentId, nextState);
      segment.display = !segment.display;
      return nextState;
    default:
      return state;
  }
}

const app = combineReducers({
  tracks
});

export default app;
