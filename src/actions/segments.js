import { 
  ADD_SEGMENT_POINT, 
  CHANGE_SEGMENT_POINT, 
  EXTEND_SEGMENT, 
  JOIN_SEGMENT, 
  REMOVE_SEGMENT, 
  REMOVE_SEGMENT_POINT, 
  SPLIT_SEGMENT, 
  TOGGLE_SEGMENT_EDITING, 
  TOGGLE_SEGMENT_JOINING, 
  TOGGLE_SEGMENT_POINT_DETAILS, 
  TOGGLE_SEGMENT_SPLITTING, 
  TOGGLE_SEGMENT_VISIBILITY, 
  TOGGLE_TIME_FILTER, 
  UPDATE_TIME_FILTER_SEGMENT,
  ADD_POSSIBILITIES,
  UPDATE_LOCATION_NAME,
  SELECT_POINT_IN_MAP,
  DESELECT_POINT_IN_MAP,
  SELECT_POINT,
  DESELECT_POINT,
  STRAIGHT_SELECTED,
  INTERPOLATED_TIME_SELECTED,
  UPDATE_POINT,
  ADD_NEW_SEGMENT,
  TOGGLE_SEGMENT_INFO,
  UPDATE_ACTIVE_LIFE,
} from ".";

import { addAlert, getLifeFromDay, removeAlert } from './general';
import { updateBounds, centerMap, addPointPrompt, removePointPrompt } from './map';
import { completeTrip } from './process';

export const centerPointOnMap = (segmentId, index) => {
  return (dispatch, getState) => {
    const { lat, lon } = getState()
      .get('tracks').get('segments').get(segmentId).get('points').get(index);
    dispatch(centerMap(lat, lon));
  }
}

export const extendSegment = (segmentId, index, lat, lon) => ({
    segmentId,
    index,
    lat,
    lon,
    type: EXTEND_SEGMENT
})


export const splitSegment = (segmentId, index) => ({
      index,
      segmentId,
      type: SPLIT_SEGMENT
})

export const addSegmentPoint = (segmentId, index, lat, lon) => ({
      segmentId,
      index,
      lat,
      lon,
      type: ADD_SEGMENT_POINT
})

export const addNewSegment = (trackId, lastTime) => {
  return (dispatch, getState) => {
    dispatch(addAlert('Click on the map to insert one point', 'success', 3, 'point-prompt'));
    dispatch(addPointPrompt((point) => {
      point.time = lastTime;

      dispatch({
        trackId,
        point,
        type: ADD_NEW_SEGMENT
      });

      dispatch(removePointPrompt());

      dispatch(removeAlert(null, 'point-prompt'));
    }))
  }
}

export const removeSegmentPoint = (segmentId, index) => ({
      segmentId,
      index,
      type: REMOVE_SEGMENT_POINT
})

export const changeSegmentPoint = (segmentId, index, lat, lon) => ({
      segmentId,
      index,
      lat,
      lon,
      type: CHANGE_SEGMENT_POINT
})

export const removeSegment = (segmentId) => ({
      segmentId,
      type: REMOVE_SEGMENT
})

export const joinSegment = (segmentId, index, details) => ({
    index,
    segmentId,
    details,
    type: JOIN_SEGMENT
})

export const fitSegment = (segmentId) => {
  return (dispatch, getState) => {
    const bounds = getState().get('tracks').get('segments').get(segmentId).get('bounds');
    dispatch(updateBounds(bounds));
  }
}

export const updateTimeFilterSegment = (segmentId, lower, upper) => ({
    segmentId,
    lower,
    upper,
    type: UPDATE_TIME_FILTER_SEGMENT
})

export const toggleTimeFilter = (segmentId) => ({
    segmentId,
    type: TOGGLE_TIME_FILTER
})

export const toggleSegmentVisibility = (segmentId, value) => ({
      segmentId,
      value,
      type: TOGGLE_SEGMENT_VISIBILITY
})
  
export const toggleSegmentEditing = (segmentId) => ({
      segmentId,
      type: TOGGLE_SEGMENT_EDITING
})
  
export const toggleSegmentSplitting = (segmentId) => ({
      segmentId,
      type: TOGGLE_SEGMENT_SPLITTING
})

export const toggleSegmentJoining = (segmentId) => {
  return (dispatch, getState) => {
    dispatch({
      segmentId,
      type: TOGGLE_SEGMENT_JOINING
    });

    const jp = getState().get('tracks').get('segments').get(segmentId).get('joinPossible');
    jp.forEach((p, i) => {
      const [start, end] = p.union[0]
      dispatch(completeTrip(segmentId, start.toJS(), end.toJS(), i))
    });
  }
}

export const addPossibilities = (segmentId, points, index, weight = 0.5) => ({
    segmentId,
    points,
    index,
    weight,
    type: ADD_POSSIBILITIES
})

export const toggleSegmentPointDetails = (segmentId) => ({
    segmentId,
    type: TOGGLE_SEGMENT_POINT_DETAILS
})

export const updateLocationName = (segmentId, name, start) => ({
  name,
  start: start,
  segmentId,
  type: UPDATE_LOCATION_NAME
})

export const selectPointInMap = (segmentId, highlightedPoint, onClick) => ({
  onClick,
  segmentId,
  highlightedPoint,
  type: SELECT_POINT_IN_MAP
})

export const deselectPointInMap = (segmentId) => ({
  segmentId,
  type: DESELECT_POINT_IN_MAP
})

export const selectPoint = (segmentId, point) => {
  return (dispatch, getState) => {
    dispatch({
      segmentId,
      point,
      type: SELECT_POINT
    });
    const selected = getState().get('tracks').get('segments').get(segmentId).get('selectedPoints');
    return selected;
  }
}

export const deselectPoint = (segmentId, point) => ({
  segmentId,
  point,
  type: DESELECT_POINT
})

export const straightSelected = (segmentId) => ({
  segmentId,
  type: STRAIGHT_SELECTED
})

export const interpolateTimeSelected = (segmentId) => ({
  segmentId,
  type: INTERPOLATED_TIME_SELECTED
})

export const updatePoint = (segmentId, index, lat, lon, time) => ({
  segmentId,
  index,
  lat,
  lon,
  time,
  type: UPDATE_POINT
})

export const toggleSegmentInfo = (value = undefined, segmentId = undefined, date = undefined) => {
  return (dispatch, getState) => {
    if (date) dispatch(getLifeFromDay(date));
    dispatch({
      value,
      segmentId, 
      type: TOGGLE_SEGMENT_INFO
    });
  }
}

export const updateActiveLIFE = (life) => ({
  life,
  type: UPDATE_ACTIVE_LIFE
})
