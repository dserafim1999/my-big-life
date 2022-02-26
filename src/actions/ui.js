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
import { updateBounds } from "./map";


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