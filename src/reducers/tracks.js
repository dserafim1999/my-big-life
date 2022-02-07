import { min, max } from "../utils";
import { removeSegment as removeSegmentAction } from "../actions/tracks";

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

const getSegmentById = (id, state) =>
  state.map((track) =>
    track.segments.find((x) => x.id === id)
  ).find((x) => !!x);

const getTrackBySegmentId = (id, state) =>
  state.map((track) =>
    track.segments.find((s) => s.id === id) ? track : null
  ).find((x) => !!x);

const addTrack = (state, action) => {
    action.track.segments.forEach((segment) => {
        segment.bounds = calculateBounds(segment.points)
    });
    
    return [...state, action.track];
}

const toggleTrackRenaming = (state, action) => {
  let nextState = [...state];
  let track = nextState.find((t) => t.id === action.trackId);

  track.renaming = !track.renaming;

  return nextState;
}

const updateTrackName = (state, action) => {
  let nextState = [...state];
  let track = nextState.find((t) => t.id === action.trackId);

  track.name = action.name;

  return nextState;
}
    
const toggleSegmentVisibility = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);
    
    segment.display = !segment.display;
    
    return nextState;
}

const toggleSegmentEditing = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);
    
    segment.editing = !segment.editing;
    segment.joining = false;
    segment.spliting = false;
    segment.pointDetails = false;
 
    return nextState;
}

const toggleSegmentSpliting = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);
    
    segment.spliting = !segment.spliting;
    segment.editing = false;
    segment.joining = false;
    segment.pointDetails = false;
    
    return nextState;
}

const toggleSegmentPointDetails = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);
    
    segment.pointDetails = !segment.pointDetails;
    segment.editing = false;
    segment.joining = false;
    segment.spliting = false;
    
    return nextState;
}

const toggleSegmentJoining = (state, action) => {
  let nextState = [...state];
  let segment = getSegmentById(action.segmentId, nextState);
  let track = getTrackBySegmentId(action.segmentId, nextState);

  if (track.segments.length > 1) {
    let possibilities = [];
    let candidates = [...track.segments];
    candidates.splice(candidates.indexOf(segment), 1); // removes segment to join from list of joinable candidates

    let sStart = segment.start;
    let sEnd = segment.end;
    let closerToStart, closerToEnd;
    let t_closerToStart = Infinity;
    let t_closerToEnd = Infinity;
    
    candidates.forEach((c, i) => {
      let { start, end } = c;
      let startDiff = start.diff(sEnd);
      let endDiff = end.diff(sStart);

      // determines points that represent possible joining points at the start and end of the segment
      if (startDiff >= 0 && startDiff < t_closerToStart) {
        t_closerToStart = startDiff;
        closerToStart = c.id;
      } else if (endDiff <= 0 && endDiff < t_closerToEnd) {
        t_closerToEnd = endDiff;
        closerToEnd = c.id;
      }
    })

    if (closerToStart !== undefined) {
      possibilities.push({
        segment: closerToStart,
        destiny: 'END',
        show: 'END'
      })
    }

    if (closerToEnd !== undefined) {
      possibilities.push({
        segment: closerToEnd,
        destiny: 'START',
        show: 'START'
      })
    }

    segment.joinPossible = possibilities;
    segment.joining = !segment.joining;
    segment.editing = false;
    segment.spliting = false;
    segment.pointDetails = false;
  }

  return nextState;
}

const changeSegmentPoint = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);

    segment.points[action.index].lat = action.lat;
    segment.points[action.index].lon = action.lon;
    segment.bounds = updateBoundsWithPoint(segment.points[action.index], segment.bounds);

    return nextState;
}

const removeSegmentPoint = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);
    
    segment.points = segment.points.filter((_, i) => i !== action.index);
    segment.bounds = calculateBounds(segment.points)
    
    return nextState;
}
    
const extendSegment = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);
    
    // when extending segment, adding points at the beggining or the end, the time will be interpolated using the delta time between the last two or next two points
    const extrapolateTime = (state, n) => {
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
        time: extrapolateTime(segment.points, action.index)
    }

    segment.bounds = updateBoundsWithPoint(pointExtend, segment.bounds);

    if (action.index === 0) {
    segment.points.unshift(pointExtend);
    } else {
    segment.points.push(pointExtend);
    }
 
    return nextState;
}

const addSegmentPoint = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);
    
    // when adding a point between two other points the time is interpolated is the difference between the two points halved.
    const extrapolateTime = (state, n) => {
        let prev = state[n - 1].time;
        let next = state[n].time;
        let diff = next.diff(prev) / 2;
        return prev.clone().add(diff);
    }

    let pointAdd = {
        lat: action.lat,
        lon: action.lon,
        time: extrapolateTime(segment.points, action.index)
    }

    segment.bounds = updateBoundsWithPoint(pointAdd, segment.bounds);
    segment.points.splice(action.index, 0, pointAdd);
    
    return nextState;
}

const removeSegment = (state, action) => {
    let track = state.map((track) => track.segments.find((s) => s.id === action.segmentId) ? track : null).find((x) => !!x);
    let nextState = [...state];

    if (track.segments.length === 1) {
        nextState.splice(nextState.indexOf(track), 1);
    } else {
        let ix = track.segments.indexOf(track.segments.find((s) => s.id === action.segmentId));
        track.segments.splice(ix, 1);
    }

    return nextState;
}

const splitSegment = (state, action) => {
    let nextState = [...state];
    let segment = getSegmentById(action.segmentId, nextState);
    let track = getTrackBySegmentId(action.segmentId, nextState);

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
}

const updateSegment = (segment) => {
  segment.start = segment.points[0].time;
  segment.end = segment.points[segment.points.length - 1].time;
  segment.bounds = calculateBounds(segment.points);
}

const joinSegment = (state, action) => {
  let nextState = [...state];
  const { details } = action;
  let segment = getSegmentById(action.segmentId, nextState);
  let toJoin = getSegmentById(details.segment, nextState);
  let index = details.destiny !== 'START' ? toJoin.points.length - 1 : 0;
  let toRemove = details.segment;
  
  segment.points.splice(index, 0, ...toJoin.points);
  updateSegment(segment);
  segment.joining = false;

  return tracks(nextState, removeSegmentAction(toRemove)); 
}

const ACTION_REACTION = {
    'track/add': addTrack,
    'track/update_name': updateTrackName,
    'track/toggle_renaming': toggleTrackRenaming,
    'segment/toggle_visibility': toggleSegmentVisibility,
    'segment/toggle_edit': toggleSegmentEditing,
    'segment/toggle_split': toggleSegmentSpliting,
    'segment/toggle_join': toggleSegmentJoining,
    'segment/toggle_point_details': toggleSegmentPointDetails,
    'segment/change_point': changeSegmentPoint,
    'segment/remove_point': removeSegmentPoint,
    'segment/add_point': addSegmentPoint,
    'segment/extend': extendSegment,
    'segment/remove': removeSegment,
    'segment/split': splitSegment,
    'segment/join': joinSegment,
}

const tracks = (state = [], action) => {
    if (ACTION_REACTION[action.type]) {
      return ACTION_REACTION[action.type](state, action)
    } else {
      return state
    }
  }

export default tracks;