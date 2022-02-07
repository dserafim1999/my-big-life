import { createTrackObj } from "./utils";
import segments from "./segments";

export const addTrack = (state, action) => {
  let { name, segments } = action;
  
  return [...state, createTrackObj(name, segments)];
}

const toggleTrackRenaming = (state, action) => {
  let nextState = [...state];
  let track = nextState.find((t) => t.id === action.trackId);

  track.renaming = !track.renaming;

  return nextState;
}

const updateTrackName = (state, action) => {
  let nextState = [...state];
  let track = nextState.find((t) => t.id === action.trackId);

  track.name = action.name;

  return nextState;
}

const ACTION_REACTION = {
    'track/add': addTrack,
    'track/update_name': updateTrackName,
    'track/toggle_renaming': toggleTrackRenaming
}

const tracks = (state = [], action) => {
    if (ACTION_REACTION[action.type]) {
      return ACTION_REACTION[action.type](state, action);
    } else {
      return segments(state, action);
    }
  }

export default tracks;