import { Map } from 'immutable';
import { 
  HIDE_TRACK_DETAILS,
  SHOW_TRACK_DETAILS,
  UPDATE_BOUNDS,
  UPDATE_INTERNAL_BOUNDS,
} from '../actions';

const initialState = Map({});

const ui = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_BOUNDS:
        return state.set('bounds', action.bounds);
      case SHOW_TRACK_DETAILS:
        return state.set('details', true);
      case HIDE_TRACK_DETAILS:
        return state.set('details', false);
      case UPDATE_INTERNAL_BOUNDS:
        return state.set('internalBounds', action.bounds);
      default:
        return state;
    }
}

export default ui;