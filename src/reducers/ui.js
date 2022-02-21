import { fromJS } from 'immutable';
import { 
  HIDE_TRACK_DETAILS,
  SHOW_TRACK_DETAILS,
  UPDATE_BOUNDS,
  UPDATE_INTERNAL_BOUNDS,
  ADD_ALERT,
  REMOVE_ALERT,
  TOGGLE_REMAINING_TRACKS
} from '../actions';

const initialState = fromJS({ alerts: [] });

const ui = (state = initialState, action) => {
    switch (action.type) {
      case UPDATE_BOUNDS:
        return state.set('bounds', fromJS(action.bounds));
      case SHOW_TRACK_DETAILS:
        return state.set('details', true);
      case HIDE_TRACK_DETAILS:
        return state.set('details', false);
      case UPDATE_INTERNAL_BOUNDS:
        return state.set('internalBounds', action.bounds);
      case REMOVE_ALERT:
        return state.update('alerts', (alerts) => {
          let index;
          if (action.alert) {
            index = alerts.findIndex((a) => a === action.alert);
          } else if (action.ref) {
            index = alerts.findIndex((a) => a.ref === action.ref);
          }

          if (index !== undefined) {
            return alerts.delete(index);
          } else {
            return alerts;
          }
        });
      case ADD_ALERT:
        return state.update('alerts', (alerts) => alerts.push({ type: action.alertType, message: action.message, duration: action.duration, ref: action.ref }));
      case TOGGLE_REMAINING_TRACKS:
        return state.set('showRemainingTracks', !state.get('showRemainingTracks'));
      default:
        return state;
    }
}

export default ui;