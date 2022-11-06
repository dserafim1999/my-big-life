import fetch from 'isomorphic-fetch';

import { REDO, REMOVE_TRACKS_FOR, SET_BULK_PROGRESS, SET_IS_BULK_PROCESSING, SET_LIFE, SET_SERVER_STATE, TOGGLE_REMAINING_TRACKS, UNDO } from '.';
import { addAlert, setLoading } from './general';
import { fitSegments } from './map';
import { reset as resetId } from '../records/idState';
import { addPossibilities } from './segments';
import { resetHistory, clearTracks } from './tracks';
import { PointRecord } from '../records';

/**
 * Converts Immutable Map of segment objects to a JSON object
 * 
 * @param {object} state Redux state
 * @returns Object with segments where the key is the segments' Id 
 */
const segmentsToJson = (state) => {
  return state.get('tracks').get('segments').valueSeq().map((segment) => {
    return {
      points: segment.get('points'),
      name: segment.get('name')
    }
  }).toJS();
}

/**
 * Set state of track processing from server 
 * 
 * @action
 * @param {number} step Current processing step 
 * @param {number} tracksRemaining Number of tracks yet to be processed 
 * @param {string} daySelected Current day to be processed 
 * @param {string} life Active LIFE string
 * @param {Array} lifeQueue List of LIFE files in input
 * @returns Action Object
 */
export const setServerState = (step, tracksRemaining, daySelected, life, lifeQueue) => ({
    step,
    life,
    tracksRemaining,
    daySelected,
    lifeQueue,
    type: SET_SERVER_STATE
})

/**
 * Fetches possible ways to complete an incomplete trip.
 * 
 * @request
 * @param {number} segmentId Segment to complete
 * @param {object} from Point to start infering trip
 * @param {object} to Point to finish infering trip
 * @param {number} index Possibility index in list of possibilities
 * @returns 
 */
export const completeTrip = (segmentId, from, to, index) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        from,
        to
      })
    };

    fetch(getState().get('general').get('server') + '/process/completeTrip', options)
      .then((response) => response.json())
      .then((json) => {
        json.possibilities.forEach((p, i) => {
          dispatch(addPossibilities(segmentId, p, index, json.weights[i]));
        });
      });
  }
}

/** 
 * Sets whether Change Day menu is active in Track Processing Module. 
 * 
 * If no boolean value is set, value is toggled.
 * 
 * @function
 * @param {bool} value If menu should be active 
 */
 export const toggleRemainingTracks = (value = undefined) => {
  return (dispatch, getState) => {
    dispatch(reloadQueue());
    dispatch({value, type: TOGGLE_REMAINING_TRACKS});
  }
}

/**
 * Updates current processing state.
 * 
 * @function
 * @param {function} dispatch Redux store action dispatcher
 * @param {object} json Object with server processing state to update
 * @param {function} getState Function that returns global state
 * @returns 
 */
const updateState = (dispatch, json, getState) => {
  resetId();
  dispatch(getBulkProcessStatus());
  
  if (!json || json.isBulkProcessing) {
    return;
  }

  if (json.currentDay === null) {
    if(json.queue.length > 0) {
      dispatch(changeDayToProcess(json.queue.pop()[0]));
    } else {
      dispatch(clearTracks());
    }
  } 
  
  dispatch(setServerState(json.step, json.queue, json.currentDay, json.life, json.lifeQueue));
  if (json.step < 0 || json.track == undefined) {
    dispatch(clearTracks());
    return;
  }

  dispatch(removeTracksFor(json.track.segments, json.track.name, true));
  dispatch(resetHistory());

  const segments = getState().get('tracks').get('segments').keySeq().toJS();
  dispatch(fitSegments(...segments));
}

/**
 * Fetches current processing state in the server.
 * 
 * @request
 */
export const requestServerState = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    fetch(getState().get('general').get('server') + '/process/current', options)
      .then((response) => response.json())
      .catch((err) => {
        dispatch(addAlert("Couldn't fetch server state.", 'error', 5, 'server-state'));
    })
    .then((json) => {
        dispatch(clearTracks());
        updateState(dispatch, json, getState);
    });
  }
}

/**
 * Returns to previous processing step.
 * 
 * @request
 */
export const previousStep = () => {
  return (dispatch, getState) => {
    dispatch(setLoading('previous-button', true));
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(getState().get('general').get('server') + '/process/previous', options)
      .then((response) => response.json())
      .catch((err) => console.log(err))
      .then((json) => updateState(dispatch, json, getState, true))
      .then(() => dispatch(setLoading('previous-button', false)));
  }
}

/**
 * Advances to next processing step.
 * 
 * @request
 */
export const nextStep = () => {
  return (dispatch, getState) => {
    dispatch(setLoading('continue-button', true));
    const hasLIFE = getState().get('process').get('LIFE');
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        track: {
          name: getState().get('tracks').get('tracks').first().get('name') || '',
          segments: segmentsToJson(getState())
        },
        LIFE: hasLIFE || '',
        changes: getState().get('tracks').get('history').get('past').map((undo) => {
          return { ...undo, undo: null };
        })
      })
    }
    
    return fetch(getState().get('general').get('server') + '/process/next', options)
      .then((response) => response.json())
      .catch((err) => console.log(err))
      .then((json) => updateState(dispatch, json, getState))
      .then(() => dispatch(setLoading('continue-button', false)));
  }
}

/**
 * Updates current day tracks based on server state changes
 * 
 * @action
 * @param {Array} segments List of segments for current day
 * @param {string} name Name of the current day's GPX file 
 * @returns 
 */
export const removeTracksFor = (segments, name) => ({
    segments,
    name,
    type: REMOVE_TRACKS_FOR
})

/**
 * Redo a step.
 * 
 * @function
 */
export const redo = () => {
  return (dispatch, getState) => {
    const state = getState().get('tracks');
    let toPut = state.get('history').get('future').get(-1);
    if (toPut) {
      toPut.undo = null;
      dispatch({
        type: REDO
      });
      return dispatch(toPut);
    } else {
      return state;
    }
  }
}

/**
 * Undo a step
 * 
 * @action
 */
export const undo = () => ({
    type: UNDO
})

/**
 * Change current selected day to process
 * 
 * @request
 * @param {string} newDay Date of new day to process 
 * @returns 
 */
export const changeDayToProcess = (newDay) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        day: newDay
      })
    }
    return fetch(getState().get('general').get('server') + '/process/changeDay', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState));
  }
}

/**
 * Reload processing queue
 * 
 * @request
 */
export const reloadQueue = () => {
  return (dispatch, getState) => {
    dispatch(setLoading('refresh-button', true));
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(getState().get('general').get('server') + '/process/reloadQueue', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState))
      .then(() => dispatch(setLoading('refresh-button', false)));
   }
}

/**
 * Ignore day to process in queue 
 * 
 * @param {string} day Date of day to dismiss
 * @returns 
 */
export const dismissDay = (day) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        day
      })
    }
    return fetch(getState().get('general').get('server') + '/process/dismissDay', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState));
  }
}

/**
 * Remove day to process from queue and input folder 
 * 
 * @param {string} day Date of day to remove 
 * @returns 
 */
export const removeDay = (files) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        files
      })
    }

    const go = confirm("Are you sure you want to remove the selected day from the input folder?");

    if (go) {
      return fetch(getState().get('general').get('server') + '/process/removeDay', options)
        .then((response) => response.json())
        .catch((e) => console.error(e))
        .then((json) => updateState(dispatch, json, getState));
    }

  }
}

/**
 * Skip day to process.
 * 
 * @request
 */
export const skipDay = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors'
    }
    return fetch(getState().get('general').get('server') + '/process/skipDay', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState));
  }
}

/**
 * Check if server is bulk processing and start fetching for progress status if so.
 * 
 * @request
 */
export const getBulkProcessStatus = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(getState().get('general').get('server') + '/process/bulkProgress', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => {
        const isBulkProcessing = json.progress >= 0 && json.progress < 100;
        dispatch(setIsBulkProcessing(isBulkProcessing));

        if (isBulkProcessing) {
          dispatch(getBulkProgress());
        }
      });
  }
}

var timeout;
/** Fetches bulk processing progress status until operation is complete */
async function getBulkProgressStatus(url, setProgress, setIsBulkProcessing, force) {  
  let progress;
  
  const options = {
    method: 'GET',
    mode: 'cors'
  }
  
  try {
    await fetch(url, options)
      .then((response) => response.json())
      .catch((err) => console.log(err))
      .then((json) => {
        progress = json.progress === -1 && force ? 0 : json.progress;
        setProgress(json.progress);
      });
  } catch (e) {
    console.error("Error: ", e);
  }
  
  if (progress < 0 || progress === 100) {
    setIsBulkProcessing;
    clearTimeout(timeout);
    return false;
  }
   
  timeout = setTimeout(() => getBulkProgressStatus(url, setProgress), 5000);
}

/**
 * Get percentage of days processed in bulk processing
 * @param {*} force 
 * @returns 
 */
const getBulkProgress = (force = false) => {
  return (dispatch, getState) => {
    getBulkProgressStatus(
      getState().get('general').get('server') + '/process/bulkProgress', 
      (progress) => dispatch(setBulkProgress(progress)),
      () => dispatch(setIsBulkProcessing(false)),
      force
    );
  }
}

/**
 * Sets whether server is bulk processing or not
 * 
 * @action
 * @param {boolean} isBulkProcessing If server is bulk processing
 * @returns Action Object 
 */
export const setIsBulkProcessing = (isBulkProcessing) => ({
  isBulkProcessing,
  type: SET_IS_BULK_PROCESSING
})

/**
 * Set percentage of days processed in bulk processing
 * 
 * @action
 * @param {number} progress Percentage of tracks already processed in bulk 
 * @returns 
 */
export const setBulkProgress = (progress) => ({
  progress,
  type: SET_BULK_PROGRESS
})

/**
 * Tells server to bulk process all tracks in input folder
 * 
 * @request
 */
export const bulkProcess = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }

    dispatch(setIsBulkProcessing(true));
    dispatch(getBulkProgress(true));
    dispatch(addAlert('Starting bulk processing. You can see the progress in the Track Processing view.', 'info', 5, 'bulk-start'));

    return fetch(getState().get('general').get('server') + '/process/bulk', options)
      .then((response) => response.json())
      .catch((err) => {
        dispatch(addAlert('Server could not complete request. Check server log for more information.', 'error', 5, 'bulk-err'));
        dispatch(setIsBulkProcessing(false));
        throw err;
      })
      .then((json) => {
        dispatch(addAlert('All tracks have been succesfully uploaded.', 'success', 5, 'bulk-done'));
        dispatch(setIsBulkProcessing(false));
        updateState(dispatch, json, getState);
      });
  }
}

/**
 * Fetches location suggestions based on coordinates
 * 
 * @function
 * @param {PointRecord} point Point to suggest location for
 * @returns 
 */
export const getLocationSuggestion = (point) => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    const addr = getState().get('general').get('server');
    return fetch(addr + '/process/location?lat=' + point.get('lat') + '&lon=' + point.get('lon'), options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((location) => location.other.map((x) => x.label));
  }
}

/**
 * Sets LIFE for track in process
 * 
 * @param {string} text LIFE string
 * @returns 
 */
export const setLIFE = (text) => {
  return {
    text,
    type: SET_LIFE
  }
}

/**
 * Copies GPX file from day into input (to be edited)
 * 
 * @param {string} date Date of day to be copied to input 
 * @returns 
 */
export const copyDayToInput = (date) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        date: date
      })
    }
    const addr = getState().get('general').get('server');
    return fetch(addr + '/process/copyDayToInput', options)
      .then((response) => response.json())
      .catch((e) => console.error(e));
  }
}