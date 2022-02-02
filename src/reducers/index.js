import { combineReducers } from 'redux';

const tracks = (state = [], action) => {
  const getSegmentById = (id, state = state) => state.map((track) => track.segments.find((x) => x.id === action.segmentId)).find((x) => !!x)

  switch (action.type) {
    case 'track/add':
      return [...state, action.track];
    case 'segment/visibility':
      let nextStateA = [...state];
      let segmentA = getSegmentById(action.segmentId, nextStateA);
      segmentA.display = !segmentA.display;
      return nextStateA;
    case 'segment/edit':
      let nextStateB = [...state];
      let segmentB = getSegmentById(action.segmentId, nextStateB);
      segmentB.pointEditing = !segmentB.pointEditing;
      return nextStateB;
    default:
      return state;
  }
}

const app = combineReducers({
  tracks
});

export default app;
