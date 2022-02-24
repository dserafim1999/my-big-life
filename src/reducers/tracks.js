import { createTrackObj } from "./utils";
import segments from "./segments";
import { Map, fromJS } from 'immutable';
import { addTrack as addTrackAction } from '../actions/tracks';

export const addTrack = (state, action) => {
  let { name, segments, locations, transModes } = action;
  let track = createTrackObj(name, segments, locations, transModes, state.get('segments').count());

  const _track = track.track;
  const _segments = track.segments;

  state = state.setIn(['tracks', _track.get('id')], _track);
  _segments.forEach((s) => {
    state = state.setIn(['segments', s.get('id')], s)
  });

  return state;
}

const addMultipleTracks = (state, action) => {
  return action.tracks.reduce((state, track) => {
    const { segments, name } = track;
    const action = addTrackAction(segments[0], name);
    return tracks(state, action);
  }, state);
}

const toggleTrackRenaming = (state, action) => {
  let renaming = !state.get('tracks').get(action.trackId).get('renaming');

  return state.setIn(['tracks', action.trackId, 'renaming'], renaming);
}

const updateTrackName = (state, action) => {
  return state.setIn(['tracks', action.trackId, 'name'], action.name);
}

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
    const transportationModes = segments.map((s) => s.transportationModes);
    const locations = segments.map((s) => [s.locationFrom, s.locationTo]);
    const act = addTrackAction(points, name, locations, transportationModes);

    return addTrack(state, act);
}

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

const redo = (state, action) => {
  return state.updateIn(['history', 'future'], (future) => future.pop());
}

const updateLIFE = (state, action) => {
  const { text, warning } = action;
  return state.set('LIFE', new Map({ text, warning }));
}

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

const ACTION_REACTION = {
    'track/add': addTrack,
    'track/remove': removeTrack,
    'track/add_multiple': addMultipleTracks,
    'track/update_name': updateTrackName,
    'track/toggle_renaming': toggleTrackRenaming,
    'track/update_life': updateLIFE,
    'progress/remove_track_for': removeTracksFor,
    'progress/undo': undo,
    'progress/redo': redo,
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