import { createTrackObj } from "./utils";
import segments from "./segments";
import { fromJS } from 'immutable';
import { addTrack as addTrackAction } from '../actions/tracks';
import { TOGGLE_TRACK_RENAMING, TOGGLE_SEGMENT_VISIBILITY, TOGGLE_SEGMENT_SPLITTING, TOGGLE_SEGMENT_POINT_DETAILS, TOGGLE_SEGMENT_JOINING, TOGGLE_SEGMENT_EDITING, UNDO, REDO } from '../actions';

export const addTrack = (state, action) => {
  let { name, segments, locations, transModes } = action;
  let track = createTrackObj(name, segments, locations, transModes, state.get('segments').count());

  const _track = track.track;
  const _segments = track.segments;

  state = state.setIn(['tracks', _track.id], fromJS(_track));
  _segments.forEach((s) => {
    state = state.setIn(['segments', s.id], fromJS(s))
  });

  return state;
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

    const { segments, name } = action
    const points = segments.map((s) => s.points)
    const transportationModes = segments.map((s) => s.transportationModes)
    const locations = segments.map((s) => [s.locationFrom, s.locationTo])
    const act = addTrackAction(points, name, locations, transportationModes)
    return addTrack(state, act)
}

const undo = (state, action) => {
  let toPut = state.get('history').get('past').get(-1)
  if (toPut) {
    return state
      .set('tracks', toPut.get('tracks'))
      .set('segments', toPut.get('segments'))
      .updateIn(['history', 'past'], (past) => {
        return past.pop()
      })
      .updateIn(['history', 'future'], (future) => {
        return future.push(state)
      })
  } else {
    return state
  }
}

const redo = (state, action) => {
  let toPut = state.get('history').get('future').get(-1)
  if (toPut) {
    return state
      .set('tracks', toPut.get('tracks'))
      .set('segments', toPut.get('segments'))
      .updateIn(['history', 'future'], (future) => {
        return future.pop()
      })
  } else {
    return state
  }
}

const ACTION_REACTION = {
    'track/add': addTrack,
    'track/update_name': updateTrackName,
    'track/toggle_renaming': toggleTrackRenaming,
    'progress/remove_track_for': removeTracksFor,
    'progress/undo': undo,
    'progress/redo': redo
}

const initialState = fromJS({
  tracks: {},
  segments: {},
  history: {
    past: [],
    future: []
  }
});

const BLACK_LISTED_ACTIONS = [TOGGLE_TRACK_RENAMING, TOGGLE_SEGMENT_VISIBILITY, TOGGLE_SEGMENT_SPLITTING, TOGGLE_SEGMENT_POINT_DETAILS, TOGGLE_SEGMENT_JOINING, TOGGLE_SEGMENT_EDITING, UNDO, REDO];

const tracks = (state = initialState, action) => {
  let result;  
  if (ACTION_REACTION[action.type]) {
      result = ACTION_REACTION[action.type](state, action);
  } else {
      result = segments(state, action);
  }
  if (result !== state && BLACK_LISTED_ACTIONS.indexOf(action.type) === -1) {
      return result.updateIn(['history', 'past'], (past) => {
        return past.push(state)
      });
  } else {
      return result;
  }
  }

export default tracks;