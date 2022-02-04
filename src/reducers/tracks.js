import { min, max } from "../utils";

const updateBoundsWithPoint = (point, bounds) => {
  return [
    { lat: min(bounds[0].lat, point.lat),
      lon: min(bounds[0].lon, point.lon)
    },
    { lat: max(bounds[1].lat, point.lat),
      lon: max(bounds[1].lon, point.lon)
    }
  ];
}
const calculateBounds = (points) => {
  let bounds = [{lat: Infinity, lon: Infinity}, {lat: -Infinity, lon: -Infinity}];
  points
    .map((t) => { return {lat: t.lat, lon: t.lon} })
      .forEach((elm) => {
      bounds[0].lat = min(bounds[0].lat, elm.lat)
      bounds[0].lon = min(bounds[0].lon, elm.lon)
      bounds[1].lat = max(bounds[1].lat, elm.lat)
      bounds[1].lon = max(bounds[1].lon, elm.lon)
    }
  );
  return bounds;
}

const tracks = (state = [], action) => {
  const getSegmentById = (id, state = state) => state.map((track) => track.segments.find((x) => x.id === id)).find((x) => !!x);
  const getTrackBySegmentId = (id, state = state) => state.map((track) => track.segments.find((s) => s.id === id) ? track : null).find((x) => !!x);
  
  let nextState, segment, track;

  switch (action.type) {
    case 'track/add':
      action.track.segments.forEach((segment) => {
        segment.bounds = calculateBounds(segment.points)
      });
      return [...state, action.track];
    
    case 'segment/toggle_visibility':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      segment.display = !segment.display;
      return nextState;

    case 'segment/toggle_edit':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      segment.editing = !segment.editing;
      segment.spliting = false;
      return nextState;

    case 'segment/toggle_split':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      segment.spliting = !segment.spliting;
      segment.editing = false;
      return nextState;
    
    case 'segment/change_point':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      segment.points[action.index].lat = action.lat;
      segment.points[action.index].lon = action.lon;
      segment.bounds = updateBoundsWithPoint(segment.points[action.index], segment.bounds);
      return nextState;

    case 'segment/remove_point':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      segment.points = segment.points.filter((_, i) => i !== action.index);
      segment.bounds = calculateBounds(segment.points)
      return nextState;

    case 'segment/extend':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      // when extending segment, adding points at the beggining or the end, the time will be interpolated using the delta time between the last two or next two points
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

      segment.bounds = updateBoundsWithPoint(pointExtend, segment.bounds);

      if (action.index === 0) {
        segment.points.unshift(pointExtend);
      } else {
        segment.points.push(pointExtend);
      }
      return nextState;

    case 'segment/add_point':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      // when adding a point between two other points the time is interpolated is the difference between the two points halved.
      const extrapolateTimeAdd = (state, n) => {
        let prev = state[n - 1].time;
        let next = state[n].time;
        let diff = next.diff(prev) / 2;
        return prev.clone().add(diff);
      }

      let pointAdd = {
        lat: action.lat,
        lon: action.lon,
        time: extrapolateTimeAdd(segment.points, action.index)
      }

      segment.bounds = updateBoundsWithPoint(pointAdd, segment.bounds);
      segment.points.splice(action.index, 0, pointAdd);
      return nextState;

    case 'segment/remove':
      track = state.map((track) => track.segments.find((s) => s.id === action.segmentId) ? track : null).find((x) => !!x);
      nextState = [...state];
      if (track.segments.length === 1) {
        nextState.splice(nextState.indexOf(track), 1);
      } else {
        let ix = track.segments.indexOf(track.segments.find((s) => s.id === action.segmentId));
        track.segments.splice(ix, 1);
      }
      return nextState;

    case 'segment/split':
      nextState = [...state];
      segment = getSegmentById(action.segmentId, nextState);
      track = getTrackBySegmentId(action.segmentId, nextState);

      let rest = segment.points.splice(action.index);
      segment.points.push(rest[0]); // adds split point to segment
      segment.end = segment.points[segment.points.length - 1].time;
      segment.spliting = false

      let seg = action.segmentInfo;
      seg.points = rest;
      seg.bounds = calculateBounds(seg.points);
      seg.start = rest[0].time;
      seg.end = rest[rest.length - 1].time

      track.segments.push(seg);
      return nextState;
    default:
      return state;
  }
}

// const ACTION_REACTION = {
//     'ADD_TRACK': addTrack,
//     'TOGGLE_SEGMENT_DISPLAY': toggleSegmentDisplay,
//     'TOGGLE_SEGMENT_EDITING': toggleSegmentEditing,
//     'CHANGE_SEGMENT_POINT': changeSegmentPoint,
//     'REMOVE_SEGMENT_POINT': removeSegmentPoint,
  
//     'EXTEND_SEGMENT_POINT': extendSegmentPoint,
//     'ADD_SEGMENT_POINT': addSegmentPoint,
//     'REMOVE_SEGMENT': removeSegment,
//     'SPLIT_SEGMENT': splitSegment,
//     'TOGGLE_SEGMENT_SPLITING': toggleSegmentSpliting,
//     'TOGGLE_SEGMENT_JOINING': toggleSegmentJoining
// }

export default tracks;