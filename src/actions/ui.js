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
  TOGGLE_CONFIG
} from "."

import { min, max } from "../utils";
import { getConfig } from "./progress";



export const fitSegments = (...segmentIds) => {
  return (dispatch, getState) => {
    const ss = getState().get('tracks').get('segments');
    const bounds = segmentIds
    .map((s) => ss.get(s).get('bounds'))
    .reduce((prev, b) => {
      prev[0][0] = min(prev[0][0], b.get(0).get('lat'));
      prev[0][1] = min(prev[0][1], b.get(0).get('lon'));
      prev[1][0] = max(prev[1][0], b.get(1).get('lat'));
      prev[1][1] = max(prev[1][1], b.get(1).get('lon'));
      return prev;
    }, [[Infinity, Infinity], [-Infinity, -Infinity]]);

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

export const highlightSegment = (segmentId) => ({
  segmentId,
  type: HIGHLIGHT_SEGMENT
})

export const dehighlightSegment = (segmentId) => ({
  segmentId,
  type: DEHIGHLIGHT_SEGMENT
})

export const toggleConfig = () => {
  const action = {
    type: TOGGLE_CONFIG
  }
  return (dispatch, getState) => {
    if (!getState().get('ui').get('showConfig')) {
      dispatch(getConfig())
        .then(() => dispatch(action))
    } else {
      dispatch(action)
    }
  }
}