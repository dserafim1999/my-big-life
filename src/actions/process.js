import fetch from 'isomorphic-fetch'
import { REDO, REMOVE_TRACKS_FOR, SET_LIFE, SET_SERVER_STATE, UNDO, UPDATE_CONFIG } from '.'
import { fitSegments, fitTracks } from './ui';
import { reset as resetId } from '../reducers/idState';
import { toggleSegmentJoining, addPossibilities } from './segments';
import { resetHistory, clearAll, displayCanonicalTrips, displayCanonicalLocations, displayAllTrips } from './tracks';
import { addAlert, setLoading } from './ui';

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
    return fetch(getState().get('process').get('server') + '/config', options)
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
    return fetch(getState().get('process').get('server') + '/config', options)
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
    return fetch(getState().get('process').get('server') + '/process/loadLIFE', options)
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
    fetch(getState().get('process').get('server') + '/process/completeTrip', options)
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
    fetch(getState().get('process').get('server') + '/process/current', options)
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
    return fetch(getState().get('process').get('server') + '/process/previous', options)
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
    console.log(options)
    return fetch(getState().get('process').get('server') + '/process/next', options)
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
    return fetch(getState().get('process').get('server') + '/process/changeDay', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState));
  }
}

export const reloadQueue = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(getState().get('process').get('server') + '/process/reloadQueue', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState));
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
    return fetch(getState().get('process').get('server') + '/process/removeDay', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState));
  }
}

export const skipDay = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      mode: 'cors'
    }
    return fetch(getState().get('process').get('server') + '/process/skipDay', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState));
  }
}

export const bulkProcess = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    return fetch(getState().get('process').get('server') + '/process/bulk', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((json) => updateState(dispatch, json, getState));
  }
}

export const getLocationSuggestion = (point) => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    const addr = getState().get('process').get('server');
    return fetch(addr + '/process/location?lat=' + point.get('lat') + '&lon=' + point.get('lon'), options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((location) => location.other.map((x) => x.label));
  }
}

export const loadCanonicalTrips = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    const addr = getState().get('process').get('server');
    return fetch(addr + '/process/canonicalTrips', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((trips) => {
        dispatch(displayCanonicalTrips(trips));
        // TODO go to last route
        dispatch(fitTracks(0));
      });
  }
}

export const loadCanonicalLocations = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    const addr = getState().get('process').get('server');
    return fetch(addr + '/process/canonicalLocations', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((trips) => {
        dispatch(displayCanonicalLocations(trips));
        // TODO go to last route
        dispatch(fitTracks(0));
      });
  }
}


export const loadTrips = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }
    const addr = getState().get('process').get('server');
    return fetch(addr + '/trips', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((trips) => {
        dispatch(clearAll());
        dispatch(displayAllTrips(trips));
      });
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
    const addr = getState().get('process').get('server');
    return fetch(addr + '/process/transportation', options)
      .then((response) => response.json())
      .catch((e) => console.error(e));
  }
}

export const setLIFE = (text) => ({
  text,
  type: SET_LIFE
})