import { createTrackObj } from "./utils";
import segments from "./segments";
import { fromJS } from 'immutable';

export const addTrack = (state, action) => {
  let { name, segments } = action;
  let track = createTrackObj(name, segments, state.get('segments').count());

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

const ACTION_REACTION = {
    'track/add': addTrack,
    'track/update_name': updateTrackName,
    'track/toggle_renaming': toggleTrackRenaming
}

const initialState = fromJS({
  tracks: {},
  segments: {}
});

const tracks = (state = initialState, action) => {
    if (ACTION_REACTION[action.type]) {
      return ACTION_REACTION[action.type](state, action);
    } else {
      return segments(state, action);
    }
  }

export default tracks;