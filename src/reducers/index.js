import { combineReducers } from 'redux';

const tracks = (state = [], action) => {
  const getSegmentById = (id, state = state) => state.map((track) => track.segments.find((x) => x.id === action.segmentId)).find((x) => !!x)
  let nextState, segment;

  switch (action.type) {
    case 'track/add':
      return [...state, action.track];
    
    case 'segment/visibility':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      segment.display = !segment.display;
      return nextState;

    case 'segment/edit':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      segment.editing = !segment.editing;
      return nextState;

    case 'segment/change_point':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState)
      segment.points[action.index].lat = action.lat;
      segment.points[action.index].lon = action.lon;
      return nextState;

    case 'segment/remove_point':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      segment.points = segment.points.filter((_, i) => i !== action.index);
      return nextState;

    case 'segment/extend':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      const extrapolateTimeExtend = (state, n) => {
        if (n === 0) {
          let prev = state[0].time;
          let next = state[1].time;
          let prediction = prev.clone().subtract(prev.diff(next));
          return prediction;
        } else {
          let prev = state[state.length - 1].time;
          let next = state[state.length - 2].time;
          let prediction = prev.clone().add(prev.diff(next));
          return prediction;
        }
      }

      let pointExtend = {
        lat: action.lat,
        lon: action.lon,
        time: extrapolateTimeExtend(segment.points, action.index)
      }

      if (action.index === 0) {
        segment.points.unshift(pointExtend);
      } else {
        segment.points.push(pointExtend);
      }
      return nextState;

    case 'segment/add_point':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      const extrapolateTimeAdd = (state, n) => {
        let prev = state[n - 1].time;
        let next = state[n + 1].time;
        let diff = prev.diff(next) / 2;
        return prev.clone().add(diff);
      }

      let pointAdd = {
        lat: action.lat,
        lon: action.lon,
        time: extrapolateTimeAdd(segment.points, action.index)
      }
      segment.points.splice(action.index, 0, pointAdd)
      return nextState;
    default:
      return state;
  }
}

const app = combineReducers({
  tracks
});

export default app;
