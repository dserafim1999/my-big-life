import { 
  ADD_SEGMENT_POINT, 
  CHANGE_SEGMENT_POINT, 
  EXTEND_SEGMENT, 
  FIT_SEGMENT, 
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
  UPDATE_TRANSPORTATION_MODE,
  SELECT_POINT_IN_MAP,
  DESELECT_POINT_IN_MAP,
  UPDATE_TRANSPORTATION_TIME,
  SELECT_POINT,
  DESELECT_POINT,
  STRAIGHT_SELECTED,
  INTERPOLATED_TIME_SELECTED,
  UPDATE_POINT,
  ADD_NEW_SEGMENT,
  REMOVE_POINT_PROMPT,
  ADD_POINT_PROMPT
} from ".";

import { completeTrip } from './progress';
import { addAlert, removeAlert } from './ui';
import moment from "moment";


export const extendSegment = (segmentId, index, lat, lon) => {
  return {
    segmentId,
    index,
    lat,
    lon,
    type: EXTEND_SEGMENT
  }
}

export const splitSegment = (segmentId, index) => {
  return {
      index,
      segmentId,
      type: SPLIT_SEGMENT
  }
}

export const addSegmentPoint = (segmentId, index, lat, lon) => {
  return {
      segmentId,
      index,
      lat,
      lon,
      type: ADD_SEGMENT_POINT
  }
}

export const addNewSegment = (trackId) => {
  return (dispatch, getState) => {
    dispatch(addAlert('Click on the map to insert one point', 'success', 3, 'point-prompt'));
    dispatch({
      callback: (point) => {
        point.time = moment();

        dispatch({
          trackId,
          point,
          type: ADD_NEW_SEGMENT
        });

        dispatch({
          type: REMOVE_POINT_PROMPT
        });

        dispatch(removeAlert(null, 'point-prompt'));
      },
      type: ADD_POINT_PROMPT
    });
  }
}

export const removeSegmentPoint = (segmentId, index) => {
  return {
      segmentId,
      index,
      type: REMOVE_SEGMENT_POINT
  }
}

export const changeSegmentPoint = (segmentId, index, lat, lon) => {
  return {
      segmentId,
      index,
      lat,
      lon,
      type: CHANGE_SEGMENT_POINT
  }
}

export const removeSegment = (segmentId) => {
  return {
      segmentId,
      type: REMOVE_SEGMENT
  }
}

export const joinSegment = (segmentId, index, details) => {
  return {
    index,
    segmentId,
    details,
    type: JOIN_SEGMENT
  }
}

export const fitSegment = (segmentId) => {
  return {
      segmentId,
      type: FIT_SEGMENT
  }
}

export const updateTimeFilterSegment = (segmentId, lower, upper) => {
  return {
    segmentId,
    lower,
    upper,
    type: UPDATE_TIME_FILTER_SEGMENT
  }
}

export const toggleTimeFilter = (segmentId) => {
  return {
    segmentId,
    type: TOGGLE_TIME_FILTER
  }
}

export const toggleSegmentVisibility = (segmentId) => {
    return {
      segmentId,
      type: TOGGLE_SEGMENT_VISIBILITY
    }
}
  
export const toggleSegmentEditing = (segmentId) => {
    return {
      segmentId,
      type: TOGGLE_SEGMENT_EDITING
    }
}
  
export const toggleSegmentSplitting = (segmentId) => {
    return {
      segmentId,
      type: TOGGLE_SEGMENT_SPLITTING
    }
}

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

export const addPossibilities = (segmentId, points, index, weight = 0.5) => {
  return {
    segmentId,
    points,
    index,
    weight,
    type: ADD_POSSIBILITIES
  }
}

export const toggleSegmentPointDetails = (segmentId) => {
  return {
    segmentId,
    type: TOGGLE_SEGMENT_POINT_DETAILS

  }
}

export const updateLocationName = (segmentId, name, start) => ({
  name,
  start: start,
  segmentId,
  type: UPDATE_LOCATION_NAME
})

export const updateTransportationMode = (segmentId, name, index) => ({
  name,
  index,
  segmentId,
  type: UPDATE_TRANSPORTATION_MODE
})

export const updateTransportationTime = (segmentId, time, start, tmodeIndex) => ({
  time,
  start,
  tmodeIndex,
  segmentId,
  type: UPDATE_TRANSPORTATION_TIME
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
  
  