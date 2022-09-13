import segments from "./segments";

import { createTrackObj } from "../records";
import { Map, fromJS } from 'immutable';
import { addTrack as addTrackAction } from '../actions/tracks';

/**
 * Adds track to global state.
 */
export const addTrack = (state, action) => {
  let { name, segments, locations } = action;
  let track = createTrackObj(name, segments, locations, state.get('segments').count());

  const _track = track.track;
  const _segments = track.segments;

  state = state.setIn(['tracks', _track.get('id')], _track);
  _segments.forEach((s) => {
    state = state.setIn(['segments', s.get('id')], s)
  });

  return state;
}

/**
 * Add multiple tracks to global state.
 * 
 * See `addTrack `.
 */
const addMultipleTracks = (state, action) => {
  return action.tracks.reduce((state, track) => {
    const { segments, name } = track;
    const action = addTrackAction(segments[0], name);
    return tracks(state, action);
  }, state);
}

/**
 * Updates current day tracks based on server state changes
 */
const removeTracksFor = (state, action) => {
  state = state
    .updateIn(['tracks'], (tracks) => {
      return tracks.clear()
    })
    .updateIn(['segments'], (segments) => {
      return segments.clear()
    });

    const { segments, name } = action;
    const points = segments.map((s) => s.points);
    const locations = segments.map((s) => [s.locationFrom, s.locationTo]);
    const act = addTrackAction(points, name, locations);

    return addTrack(state, act);
}

/**
 * Undo changes to track
 */
const undo = (state, action) => {
  let toPut = state.get('history').get('past').get(-1);
  if (toPut) {
    return toPut.undo(toPut, state)
    .updateIn(['history', 'past'], (past) => past.pop())
    .updateIn(['history', 'future'], (future) => {
      future = future.push(toPut);
      if (UNDO_LIMIT !== Infinity) {
        return future.slice(future.count() - UNDO_LIMIT);
      } else {
        return future;
      }
    })
  } else {
    return state;
  }
}

/**
 * Redo changes to track
 */
const redo = (state, action) => {
  return state.updateIn(['history', 'future'], (future) => future.pop());
}

/**
 * Updates the LIFE representation of a track.
 */
const updateTrackLIFE = (state, action) => {
  const { text, warning } = action;
  return state.set('LIFE', new Map({ text, warning }));
}

/**
 * Reset history of changes to track
 */
const resetHistory = (state, action) => {
  return state
    .updateIn(['history', 'future'], (history) => history.clear())
    .updateIn(['history', 'past'], (history) => history.clear());
}

/**
 * Remove a track from the global state.
 */
const removeTrack = (state, action) => {
  const { trackId } = action;

  action.undo = (self, newState) => {
    return state;
  }

  let cState = state;
  state.get('tracks').get(trackId).get('segments').forEach((seg) => {
    cState = cState.deleteIn(['segments', seg]);
  })
  return cState.deleteIn(['tracks', trackId]);
}

/**
 * Remove all tracks/segments from state.
 */
const clearTracks = (state, action) => {
  return initialState;
}

const ACTION_REACTION = {
    'tracks/add': addTrack,
    'tracks/remove': removeTrack,
    'tracks/add_multiple': addMultipleTracks,
    'tracks/update_LIFE': updateTrackLIFE,
    'tracks/reset_history': resetHistory,
    'tracks/remove_track_for': removeTracksFor,
    'tracks/clear_tracks': clearTracks,
    'tracks/undo': undo,
    'tracks/redo': redo,
}


// Number or Infinity
const UNDO_LIMIT = 50

const initialState = fromJS({
  tracks: {},
  segments: {},
  history: {
    past: [],
    future: []
  }
});

const tracks = (state = initialState, action) => {
  let result;  
  if (ACTION_REACTION[action.type]) {
      result = ACTION_REACTION[action.type](state, action);
  } else {
      result = segments(state, action);
  }
  if (result !== state && action.undo) {
      return result.updateIn(['history', 'past'], (past) => {
        past = past.push(action)
        if (UNDO_LIMIT !== Infinity) {
          return past.slice(past.count() - UNDO_LIMIT);
        } else {
          return past;
        }
      });
  } else {
      return result;
  }
}

export default tracks;