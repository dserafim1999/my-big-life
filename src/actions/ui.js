import { 
  HIDE_TRACK_DETAILS,
  SHOW_TRACK_DETAILS,
  UPDATE_BOUNDS,
  UPDATE_INTERNAL_BOUNDS,
  ADD_ALERT,
  REMOVE_ALERT,
  TOGGLE_REMAINING_TRACKS,
  CENTER_MAP,
  DEHIGHLIGHT_SEGMENT,
  HIGHLIGHT_SEGMENT,
  TOGGLE_CONFIG,
  HIGHLIGHT_POINT,
  DEHIGHLIGHT_POINT
} from "."

import { getConfig } from "./progress";
import { BoundsRecord } from '../records';


export const fitSegments = (...segmentIds) => {
  return (dispatch, getState) => {
    const ss = getState().get('tracks').get('segments');
    const bounds = segmentIds.reduce((prev, segId) => {
      const segmentBounds = ss.get(segId).get('bounds');
      return prev.updateWithBounds(segmentBounds);
    }, new BoundsRecord());

    dispatch(updateBounds(bounds));
  }
}

export const updateBounds = (bounds) => {
    return {
      bounds,
      type: UPDATE_BOUNDS
    }
}

export const hideDetails = () => {
  return {
    type: HIDE_TRACK_DETAILS
  }
}
export const showDetails = () => {
  return {
    type: SHOW_TRACK_DETAILS
  }
}

export const updateInternalBounds = (bounds) => {
  return {
    bounds,
    type: UPDATE_INTERNAL_BOUNDS
  }
}

export const addAlert = (message, type = 'error', duration = 5, ref = undefined) => {
  return {
    message,
    duration,
    ref,
    alertType: type,
    type: ADD_ALERT
  }
}

export const removeAlert = (alert, ref) => {
  return {
    alert,
    ref,
    type: REMOVE_ALERT
  }
}

export const toggleRemainingTracks = () => {
  return {
    type: TOGGLE_REMAINING_TRACKS
  }
}

export const centerMap = (lat, lon) => {
  return {
    lat,
    lon,
    type: CENTER_MAP
  }
}

export const highlightSegment = (segmentsIds) => ({
  segmentsIds,
  type: HIGHLIGHT_SEGMENT
})

export const dehighlightSegment = (segmentsIds) => ({
  segmentsIds,
  type: DEHIGHLIGHT_SEGMENT
})

export const highlightPoint = (points) => ({
  points,
  type: HIGHLIGHT_POINT
})

export const dehighlightPoint = (points) => ({
  points,
  type: DEHIGHLIGHT_POINT
})

export const toggleConfig = () => {
  const action = {
    type: TOGGLE_CONFIG
  }
  return (dispatch, getState) => {
    if (!getState().get('ui').get('showConfig')) {
      dispatch(getConfig())
        .then(() => dispatch(action))
        .catch(() => dispatch(action));
    } else {
      dispatch(action)
    }
  }
}