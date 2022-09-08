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
  SELECT_POINT,
  DESELECT_POINT,
  STRAIGHT_SELECTED,
  UPDATE_POINT,
  ADD_NEW_SEGMENT,
  TOGGLE_SEGMENT_INFO,
  UPDATE_ACTIVE_LIFE,
} from ".";

import { addAlert, getLifeFromDay, removeAlert } from './general';
import { centerMap, addPointPrompt, removePointPrompt } from './map';
import { completeTrip } from './process';

/**
 * Centers the map on a Segment's point.
 * 
 * @function
 * @param {number} segmentId Segment Id
 * @param {number} index Index of the point to be centered
 */
export const centerSegmentPointOnMap = (segmentId, index) => {
  return (dispatch, getState) => {
    const { lat, lon } = getState()
      .get('tracks').get('segments').get(segmentId).get('points').get(index);
    dispatch(centerMap(lat, lon));
  }
}

/**
 * Adds a new point to the end of a segment.
 * 
 * @action
 * @param {number} segmentId Segment Id
 * @param {number} index Index of last point in segment
 * @param {number} lat New point's latitude
 * @param {number} lon New point's longitude
 * @returns Action Object
 */
export const extendSegment = (segmentId, index, lat, lon) => ({
    segmentId,
    index,
    lat,
    lon,
    type: EXTEND_SEGMENT
})

/**
 * Splits a segment into two on the point with the provided index.
 * 
 * @action
 * @param {number} segmentId Segment Id
 * @param {number} index Index of the segment point to split
 * @returns Action Object
 */
export const splitSegment = (segmentId, index) => ({
      index,
      segmentId,
      type: SPLIT_SEGMENT
})

/**
 * Add a point to a segment.
 * 
 * @action
 * @param {number} segmentId Segment Id
 * @param {number} index Index of new point in segment
 * @param {number} lat New point's latitude
 * @param {number} lon New point's longitude
 * @returns Action Object
 */
export const addSegmentPoint = (segmentId, index, lat, lon) => ({
      segmentId,
      index,
      lat,
      lon,
      type: ADD_SEGMENT_POINT
})

/**
 * Adds new segment to track.
 * 
 * @function
 * @param {number | string} trackId Track Id 
 * @param {Date} lastTime Date of last point in track
 */
export const addNewSegment = (trackId, lastTime) => {
  return (dispatch, getState) => {
    dispatch(addAlert('Click on the map to insert a point.', 'info', 3, 'point-prompt'));
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

/**
 * Remove point from segment.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @param {number} index Index of point to remove from segment
 * @returns Action Object
 */
export const removeSegmentPoint = (segmentId, index) => ({
      segmentId,
      index,
      type: REMOVE_SEGMENT_POINT
})

/**
 * Move segment point's position.
 * 
 * @action
 * @param {number} segmentId Segment Id
 * @param {number} index Index of point to edit
 * @param {number} lat New latitude
 * @param {number} lon New longitude
 * @returns Action Object
 */
export const changeSegmentPoint = (segmentId, index, lat, lon) => ({
      segmentId,
      index,
      lat,
      lon,
      type: CHANGE_SEGMENT_POINT
})

/**
 * Removes segment from list of segments.
 * 
 * @action
 * @param {number} segmentId Segment id
 * @returns Action Object
 */
export const removeSegment = (segmentId) => ({
      segmentId,
      type: REMOVE_SEGMENT
})

/**
 * Joins two segments together into one.
 * 
 * @action
 * @param {number} segmentId Segment Id
 * @param {number} index Index of segmentt point to join
 * @param {number} details 
 * @returns Action Object
 */
export const joinSegment = (segmentId, index, details) => ({
    index,
    segmentId,
    details,
    type: JOIN_SEGMENT
})

/**
 * Updates segment time filter.
 * 
 * @action
 * @param {number} segmentId Segment id
 * @param {Date} lower Earliest date for filter 
 * @param {Date} upper Latest date for filter
 * @returns Action Object
 */
export const updateTimeFilterSegment = (segmentId, lower, upper) => ({
    segmentId,
    lower,
    upper,
    type: UPDATE_TIME_FILTER_SEGMENT
})

/**
 * Toggle whether segment's time filter is active.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @returns Action Object
 */
export const toggleTimeFilter = (segmentId) => ({
    segmentId,
    type: TOGGLE_TIME_FILTER
})

/**
 * Toggle whether segment is visible.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @param {boolean} value If segment is active 
 * @returns Action Object
 */
export const toggleSegmentVisibility = (segmentId, value) => ({
      segmentId,
      value,
      type: TOGGLE_SEGMENT_VISIBILITY
})

/**
 * Toggle whether segment is in edit mode.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @returns Action Object 
 */
export const toggleSegmentEditing = (segmentId) => ({
      segmentId,
      type: TOGGLE_SEGMENT_EDITING
})
  
/**
 * Toggle whether segment is in split mode.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @returns Action Object
 */
export const toggleSegmentSplitting = (segmentId) => ({
      segmentId,
      type: TOGGLE_SEGMENT_SPLITTING
})

/**
 * Toggle whether segment is in join mode.
 * 
 * @function
 * @param {number} segmentId Segment Id 
 * @returns Action Object
 */
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

/**
 * Toggle whether segment is in point details mode.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @returns Action Object 
 */
export const toggleSegmentPointDetails = (segmentId) => ({
    segmentId,
    type: TOGGLE_SEGMENT_POINT_DETAILS
})

/**
 * Add trip completion possibilities.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @param {Array} points Points that define the possibility
 * @param {number} index Index of the segment point to join
 * @param {number} weight Represents how strong a possibility is compared to others
 * @returns Action Object
 */
export const addPossibilities = (segmentId, points, index, weight = 0.5) => ({
    segmentId,
    points,
    index,
    weight,
    type: ADD_POSSIBILITIES
})


/**
 * TODO
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @param {*} name 
 * @param {*} start 
 * @returns Action Object
 */
export const updateLocationName = (segmentId, name, start) => ({
  name,
  start: start,
  segmentId,
  type: UPDATE_LOCATION_NAME
})


/**
 * Add point to selected points list.
 * 
 * @function
 * @param {number} segmentId Segment Id 
 * @param {object} point Segment point to select 
 * @returns Action Object 
 */
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

/**
 * Remove point from selected points list.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @param {object} point Segment point to remove from selected points list 
 * @returns Action Object
 */
export const deselectPoint = (segmentId, point) => ({
  segmentId,
  point,
  type: DESELECT_POINT
})

/**
 * Straightens segment portion containing selected points.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @returns Action Object
 */
export const straightSelected = (segmentId) => ({
  segmentId,
  type: STRAIGHT_SELECTED
})

/**
 * Edit point location and date.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @param {number} index Index of point in segment
 * @param {number} lat New latitude
 * @param {number} lon New longitude
 * @param {Date} time New timestamp 
 * @returns Action Object
 */
export const updatePoint = (segmentId, index, lat, lon, time) => ({
  segmentId,
  index,
  lat,
  lon,
  time,
  type: UPDATE_POINT
})

/**
 * Toggle panel with segment information.
 * 
 * @action
 * @param {boolean} value If panel is active
 * @param {number} segmentId Segment Id 
 * @param {Date} date Segment day 
 * @returns Action Object 
 */
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

/**
 * Update active segment LIFE string in state.
 * 
 * @action
 * @param {string} life Segment LIFE representation 
 * @returns Action Object
 */
export const updateActiveLIFE = (life) => ({
  life,
  type: UPDATE_ACTIVE_LIFE
})
