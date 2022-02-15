import { fromJS } from 'immutable';
import { 
  HIDE_TRACK_DETAILS,
  REMOVE_ALERT,
  SHOW_TRACK_DETAILS,
  UPDATE_BOUNDS,
  UPDATE_INTERNAL_BOUNDS,
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
          const index = alerts.findIndex((a) => a === action.alert);
          if (index !== undefined) {
            return alerts.delete(index);
          } else {
            return alerts;
          }
        });
      case ADD_ALERT:
        return state.update('alerts', (alerts) => alerts.push({ type: action.alertType, message: action.message }));
      default:
        return state;
    }
}

export default ui;