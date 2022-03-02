import { 
  ADD_ALERT,
  REMOVE_ALERT,
  TOGGLE_REMAINING_TRACKS,
  SET_LOADING
} from "."

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

export const fitTracks = (...trackIds) => {
  return (dispatch, getState) => {
    const tracks = getState().get('tracks').get('tracks');
    const segments = getState().get('tracks').get('segments');
    const bounds = trackIds.reduce((prev, trackId) => {
      const trackSegments = tracks.get(trackId).get('segments');
      return trackSegments.reduce((pr, segmentId) => {
        const segmentBounds = segments.get(segmentId).get('bounds');
        return pr.updateWithBounds(segmentBounds);
      }, prev);
    }, new BoundsRecord());

    dispatch(updateBounds(bounds));
  }
}

export const toggleRemainingTracks = () => {
  return {
    type: TOGGLE_REMAINING_TRACKS
  }
}

export const setLoading = (ref, is) => ({
  is,
  ref,
  type: SET_LOADING
})