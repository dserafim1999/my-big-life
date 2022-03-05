import { 
  ADD_ALERT,
  REMOVE_ALERT,
  TOGGLE_REMAINING_TRACKS,
  SET_LOADING,
  UPDATE_CONFIG,
  UPDATE_SERVER
} from "."

import { BoundsRecord } from '../records';
import { updateBounds } from "./map";
import { clearAll, displayAllTrips } from "./tracks";


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

export const updateConfig = (config) => ({
  config,
  type: UPDATE_CONFIG
})

export const getConfig = (dispatch) => {
  dispatch(setLoading('config', true));
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(getState().get('general').get('server') + '/config', options)
      .then((response) => response.json())
      .then((config) => dispatch(updateConfig(config)))
      .then(() => dispatch(setLoading('config', false)));
  }
}

export const saveConfig = (config) => {
  config._ = null;
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(config)
    }
    return fetch(getState().get('general').get('server') + '/config', options)
      .then((response) => response.json())
      .catch((err) => {
        dispatch(addAlert('Error while saving configurations to the server', 'error', 5, 'config-err'));
        throw err;
    })
    .then((config) => {
        dispatch(addAlert('Configurations saved to the server', 'success', 5, 'config-done'));
        // TODO go to last route
    });
  }
}

export const updateServer = (server) => {
  return {
    server,
    type: UPDATE_SERVER
  }
}

export const loadTrips = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    const addr = getState().get('general').get('server');
    return fetch(addr + '/trips', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((trips) => {
        dispatch(clearAll());
        dispatch(displayAllTrips(trips));
      });
  }
}