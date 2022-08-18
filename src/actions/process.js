import fetch from 'isomorphic-fetch';
import { COPY_DAY_TO_INPUT, REDO, REMOVE_TRACKS_FOR, SET_LIFE, SET_SERVER_STATE, UNDO } from '.';
import { addAlert, fitSegments, setLoading } from './general';
import { reset as resetId } from '../reducers/idState';
import { toggleSegmentJoining, addPossibilities } from './segments';
import { resetHistory, clearAll } from './tracks';

const segmentsToJson = (state) => {
  return state.get('tracks').get('segments').valueSeq().map((segment) => {
    return {
      points: segment.get('points'),
      name: segment.get('name')
    }
  }).toJS();
}

export const handleError = (error, dispatch) => {
  if (error.message === 'Failed to fetch') {
    //TODO route to config
  }
}

export const setServerState = (step, tracksRemaining, daySelected, life, lifeQueue) => {
  return {
    step,
    life,
    tracksRemaining,
    daySelected,
    lifeQueue,
    type: SET_SERVER_STATE
  }
}

export const loadLIFE = (content) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: content
    }
    return fetch(getState().get('general').get('server') + '/process/loadLIFE', options)
      .catch((e) => console.error(e))
      .then((response) => response.json());
  }
}

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

    console.log('going to the server');
    fetch(getState().get('general').get('server') + '/process/completeTrip', options)
      .then((response) => response.json())
      // .catch((err) => {
      //   console.log(err);
      // })
      .then((json) => {
        json.possibilities.forEach((p, i) => {
          dispatch(addPossibilities(segmentId, p, index, json.weights[i]));
        });
      });
  }
}

const updateState = (dispatch, json, getState, reverse = false) => {
  resetId();
  
  if (!json) {
    return;
  }

  if (json.currentDay === null) {
    if(json.queue.length > 0) {
      dispatch(changeDayToProcess(json.queue.pop()[0]));
    } else {
      dispatch(clearAll());
    }
  } 
  
  dispatch(setServerState(json.step, json.queue, json.currentDay, json.life, json.lifeQueue));
  if (json.step < 0 || json.track == undefined) {
    dispatch(clearAll());
    return;
  }

  dispatch(removeTracksFor(json.track.segments, json.track.name, true));
  dispatch(resetHistory());

  // joins two consecutive segments that don't connect
  const step = getState().get('process').get('step');
  if (step === 0) {
    getState()
      .get('tracks').get('segments').valueSeq()
      .sort((a, b) => {
        return a.getStartTime().diff(b.getStartTime());
      })
      .forEach((segment, i, arr) => {
        const next = arr.get(i + 1);
        if (next) {
          const from = segment.get('points').get(-1);
          const to = next.get('points').get(0);
          const distance = from.distance(to);
          if (distance > 20 * 0.001) {
            dispatch(toggleSegmentJoining(segment.get('id')));
          }
        }
      });
  }

  const segments = getState().get('tracks').get('segments').keySeq().toJS();
  dispatch(fitSegments(...segments));
}

export const requestServerState = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    fetch(getState().get('general').get('server') + '/process/current', options)
      .then((response) => response.json())
      .catch((err) => {
        handleError(err, dispatch);
    })
    .then((json) => {
        dispatch(clearAll());
        updateState(dispatch, json, getState)
    });
  }
}

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

export const removeTracksFor = (segments, name) => {
  return {
    segments,
    name,
    type: REMOVE_TRACKS_FOR
  }
}

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

export const undo = () => {
  return {
    type: UNDO
  }
}


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

export const bulkProcess = () => {
  return (dispatch, getState) => {
    dispatch(setLoading('bulk-button', true));
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(getState().get('general').get('server') + '/process/bulk', options)
      .then((response) => response.json())
      .catch((err) => {
        dispatch(addAlert('Server could not complete request. Check server log for more information.', 'error', 5, 'bulk-err'));
        dispatch(setLoading('bulk-button', false));
        throw err;
      })
      .then((json) => {
        dispatch(addAlert('All tracks have been succesfully uploaded.', 'success', 5, 'bulk-done'));
        dispatch(setLoading('bulk-button', false));
        updateState(dispatch, json, getState)
      });
  }
}

export const rawBulkProcess = () => {
  return (dispatch, getState) => {
    dispatch(setLoading('bulk-button', false));

    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(getState().get('general').get('server') + '/process/rawBulk', options)
      .then((response) => response.json())
      .catch((err) => {
        dispatch(addAlert('Server could not complete request. Check server log for more information.', 'error', 5, 'config-err'));
        dispatch(setLoading('bulk-button', false));
        throw err;
      })
      .then((json) => {
        dispatch(addAlert('All tracks have been succesfully uploaded.', 'success', 5, 'bulk-done'));
        dispatch(setLoading('bulk-button', false));
        updateState(dispatch, json, getState)
      });
  }
}

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

export const requestTransportationSuggestions = (points) => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify({
        points
      })
    }
    const addr = getState().get('general').get('server');
    return fetch(addr + '/process/transportation', options)
      .then((response) => response.json())
      .catch((e) => console.error(e));
  }
}

export const setLIFE = (text) => {
  return {
    text,
    type: SET_LIFE
  }
}

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