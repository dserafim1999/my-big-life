import moment from "moment";
import { 
  ADD_ALERT,
  REMOVE_ALERT,
  SET_LOADING,
  UPDATE_CONFIG,
  UPDATE_SERVER,
  UPDATE_VIEW,
  TOGGLE_UI,
  SET_APP_LOADING,
  UPDATE_GLOBAL_LIFE,
  UPDATE_SELECTED_DAY,
  REMOVE_DAY_FROM_GLOBAL_LIFE,
} from "."
import { removeTrip, clearTrips } from "./trips";
import { clearTracks } from "./tracks";
import { MAP_DETAIL_ZOOM_LEVEL } from "../constants";


/**
 * Adds an alert to the alert queue
 * 
 * @action
 * @param {string} message Message to be displayed on alert
 * @param {string} type Alert type 
 * @param {number} duration Alert duration 
 * @param {string} ref Alert identifier 
 * @returns Action object
 */
export const addAlert = (message, type = 'error', duration = 5, ref = undefined) => ({
    message,
    duration,
    ref,
    alertType: type,
    type: ADD_ALERT
})

/**
 * Removes an alert from the alert queue
 * 
 * @action
 * @param {object} alert Alert object
 * @param {string} ref Alert identifier
 * @returns Action object
 */
export const removeAlert = (alert, ref) => ({
    alert,
    ref,
    type: REMOVE_ALERT
})

/**
 * Adds/Removes Loading status with certain identifier.
 * 
 * Used to indicate if some operation is in process in order to add loading behaviour to component.
 * 
 * @action
 * @param {string} ref Loading button identifier 
 * @param {bool} is If should be loading
 * @returns Action Object
 */
export const setLoading = (ref, is) => ({
  is,
  ref,
  type: SET_LOADING
})

/**
 * Sets whether the app should load globally or not.
 * 
 * Used to set `LoadingOverlay` over the application.
 * 
 * @action
 * @param {bool} isLoading If app should be loading
 * @returns Action Object
 */
export const setAppLoading = (isLoading) => ({
  isLoading,
  type: SET_APP_LOADING
})

/**
 * Updates global configurations.
 * 
 * @action
 * @param {object} config New configuration object
 * @returns Action Object
 */
export const updateConfig = (config) => ({
  config,
  type: UPDATE_CONFIG
})

export const getConfig = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }

    dispatch(setLoading('config', true));
    
    return fetch(getState().get('general').get('server') + '/config', options)
      .then((response) => response.json())
      .then((config) => dispatch(updateConfig(config)))
      .then(() => dispatch(setLoading('config', false)));
  }
}

/**
 * Sends configuration object to server to be saved.
 * 
 * @request
 * @param {object} config 
 */
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
      });
  }
}

/**
 * Send a file to the server
 * 
 * @request
 * @param {object} file Object that contains file name and content
 */
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

/**
 * Updates server address
 * 
 * @action
 * @param {string} server 
 * @returns Action Object
 */
export const updateServer = (server) => ({
    server,
    type: UPDATE_SERVER
})

/**
 * Updates the current active view in the application
 * 
 * @function
 * @param {number} view Module View id 
 * @param {string} route Route to navigate to 
 * @param {function} navigate Function that navigates to route
 */
export const updateView = (view, route, navigate) => {
  navigate(route);
  
  return (dispatch, getState) => {
    dispatch(clearTrips());
    dispatch(clearTracks());
    dispatch({view, type: UPDATE_VIEW});
  }
}

/**
 * Toggles UI visibility 
 * 
 * @action
 * @param {bool} isVisible If UI is visible 
 * @returns Action Object
 */
export const toggleUI = (isVisible) => ({
  isVisible,
  type: TOGGLE_UI
})

/**
 * Update current selected day
 * 
 * @action
 * @param {Date | boolean} date moment date object
 * @returns Action Object
 */
export const setSelectedDay = (date) => {
  return (dispatch, getState) => {
    let color = 'lightgrey';

    if (date) {
      const lifeDay = getState().get('general').get('LIFE').days.find((day) => day.date === date.format("--YYYY_MM_DD"));

      if (lifeDay === undefined) {
        dispatch(addAlert('Cannot find day in database.', 'error', 2, 'invalid-day'));
        date = false;
      } else {
        const dayTrip = getState().get('trips').get('trips').get(date.format("YYYY-MM-DD"));
        const zoom = getState().get('map').get('zoom');
        
        if(dayTrip) {
          color = dayTrip.color;
        } 
        if (!zoom || (zoom &&  zoom < MAP_DETAIL_ZOOM_LEVEL)) {
          dispatch(addAlert('Zoom in to see day in full detail.', 'info', 2, 'zoom-in'));
        }
      }

    }
    
    dispatch({ date, color, type: UPDATE_SELECTED_DAY })
  }
}

/**
 * Fetches global LIFE JSON file
 * 
 * @request 
 */
export const getGlobalLife = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    dispatch(setLoading('life-viewer', true));
    const addr = getState().get('general').get('server');
    return fetch(addr + '/life', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((res) => {
        dispatch(setGlobalLIFE(res));
        dispatch(setLoading('life-viewer', false));
      });
  }
}

/**
 * Updates global LIFE file
 * 
 * @action 
 * @param {string} life LIFE string
 */
export const setGlobalLIFE = (life) => ({
  life,
  type: UPDATE_GLOBAL_LIFE
})

/**
 * Delete day from global LIFE file
 * 
 * @action 
 * @param {string} date '--YYYY_MM_DD' format
 */
 export const removeDayFromGlobalLIFE = (date) => ({
  date,
  type: REMOVE_DAY_FROM_GLOBAL_LIFE
})

/**
 * Deletes a day from the server (including database)
 * 
 * @request
 * @param {string} date 'YYYY-MM-DD' format
 * @returns 
 */
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
          dispatch(setSelectedDay(false));
          dispatch(removeTrip(moment(date).format('YYYY-MM-DD')));
          dispatch(removeDayFromGlobalLIFE(moment(date).format('--YYYY_MM_DD')));
          dispatch(addAlert(moment(date).format('DD/MM/YYYY') + " has been successfully deleted from the database.", 'success'));
        })
    }
  }
}