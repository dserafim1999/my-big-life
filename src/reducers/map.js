import { Record, List, Set } from 'immutable';
import {
  CENTER_MAP,
  UPDATE_BOUNDS,
  HIGHLIGHT_POINT,
  DEHIGHLIGHT_POINT,
  HIGHLIGHT_SEGMENT,
  DEHIGHLIGHT_SEGMENT,
  ADD_POINT_PROMPT,
  REMOVE_POINT_PROMPT,
  SELECT_POINT_ON_MAP,
  DESELECT_POINT_ON_MAP,
  SET_ZOOM_LEVEL
} from '../actions';

/**
 * Update highlighted segments.
 */
const changeSegmentHighlight = (state, action) => {
  let fn;
  if (action.type === HIGHLIGHT_SEGMENT) {
    fn = (highlighted, segId) => highlighted.add(segId);
  } else {
    fn = (highlighted, segId) => highlighted.delete(segId);
  }
  return state.update('highlighted', (highlighted) => {
    return action.segmentsIds.reduce((highlighted, segId) => {
      return fn(highlighted, segId);
    }, highlighted.clear());
  });
}

/**
 * Update highlighted segment points.
 */
const changePointHighlight = (state, action) => {
  let fn;
  if (action.type === HIGHLIGHT_POINT) {
    fn = (highlighted, point) => highlighted.push(point);
  } else {
    fn = (highlighted, point) => highlighted.remove(highlighted.indexOf(point));
  }
  return state.update('highlightedPoints', (highlighted) => {
    return action.points.reduce((highlighted, points) => {
      return fn(highlighted, points);
    }, highlighted.clear());
  });
}

const selectPointOnMap = (state, action) => {
  const { onClick, segmentId, highlightedPoint } = action;
  return state.setIn(['segments', segmentId, 'pointAction'], Map({ highlightedPoint, onClick }));
}

const deselectPointOnMap = (state, action) => {
  const { segmentId } = action;
  return state.setIn(['segments', segmentId, 'pointAction'], null);
}

const MapRecord = new Record({
  bounds: undefined,
  zoom: undefined,
  center: undefined,
  pointPrompt: undefined,
  highlighted: new Set([]),
  highlightedPoints: new List([])
});

const INITIAL_STATE = new MapRecord();

const map = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_BOUNDS:
      return state.set('bounds', action.bounds);
    case SET_ZOOM_LEVEL:
      return state.set('zoom', action.zoom);
    case CENTER_MAP:
      return state.set('center', { lat: action.lat, lon: action.lon });
    case HIGHLIGHT_SEGMENT:
    case DEHIGHLIGHT_SEGMENT:
      return changeSegmentHighlight(state, action);
    case HIGHLIGHT_POINT:
    case DEHIGHLIGHT_POINT:
      return changePointHighlight(state, action);
    case ADD_POINT_PROMPT:
      return state.set('pointPrompt', action.callback);
    case REMOVE_POINT_PROMPT:
      return state.set('pointPrompt', null);
    case SELECT_POINT_ON_MAP:
      return selectPointOnMap(state, action);
    case DESELECT_POINT_ON_MAP:
      return deselectPointOnMap(state, action);
    default:
      return state;
  }
}

export default map;