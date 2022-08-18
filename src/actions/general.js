import moment from "moment";
import { 
  ADD_ALERT,
  REMOVE_ALERT,
  TOGGLE_REMAINING_TRACKS,
  SET_LOADING,
  UPDATE_CONFIG,
  UPDATE_SERVER,
  UPDATE_VIEW,
  TOGGLE_UI,
} from "."

import { BoundsRecord } from '../records';
import { updateBounds } from "./map";
import { reloadQueue } from "./process";
import { toggleSegmentInfo, updateActiveLIFE } from "./segments";
import { clearAll, displayLocations, displayCanonicalTrips, displayTrips, removeTrack } from "./tracks";

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

export const toggleRemainingTracks = (value = undefined) => {
  return (dispatch, getState) => {
    dispatch(reloadQueue());
    dispatch({value, type: TOGGLE_REMAINING_TRACKS});
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

export const uploadFile = (file) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(file)
    }
    return fetch(getState().get('general').get('server') + '/uploadFile', options)
      .then((response) => response.json());
  }
}

export const updateServer = (server) => ({
    server,
    type: UPDATE_SERVER
})

export const updateView = (view, route, navigate) => {
  navigate(route);
  
  return (dispatch, getState) => {
    dispatch(clearAll());
    dispatch({view, type: UPDATE_VIEW});
  }
}

export const toggleUI = (isVisible) => ({
  isVisible,
  type: TOGGLE_UI
})

export const loadTripsAndLocations = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    const addr = getState().get('general').get('server');
    return fetch(addr + '/tripsLocations', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((res) => {
        dispatch(displayCanonicalTrips(res.trips));
        dispatch(displayLocations(res.locations));
      });
  }
}

export const loadAllTrips = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    const addr = getState().get('general').get('server');
    return fetch(addr + '/allTrips', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((res) => {
        dispatch(displayTrips(res.trips))
      });
  }
}

export const getLifeFromDay = (date) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({date: date})
    }
    const addr = getState().get('general').get('server');
    return fetch(addr + '/lifeFromDay', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((res) => {
        dispatch(updateActiveLIFE(res));
      });
  }
}

export const deleteDay = (date) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        date
      })
    }

    const go = confirm("Are you sure you want to delete the selected day from the database?");

    if (go) {
      return fetch(getState().get('general').get('server') + '/deleteDay', options)
        .then((response) => response.json())
        .catch((e) => console.error(e))
        .then((res) => {
          dispatch(toggleSegmentInfo(false));
          dispatch(removeTrack(moment(date).format('YYYY-MM-DD')));
          dispatch(addAlert(moment(date).format('DD/MM/YYYY') + " has been successfully deleted from the database.", 'success'));
          dispatch(loadTripsAndLocations());
          //TODO update canonical trips
        })
    }
  }
}