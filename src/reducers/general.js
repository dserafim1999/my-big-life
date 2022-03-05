import { Map, List, Set } from 'immutable';
import { 
  ADD_ALERT,
  REMOVE_ALERT,
  TOGGLE_REMAINING_TRACKS,
  SET_LOADING,
  UPDATE_CONFIG,
  UPDATE_SERVER,
} from '../actions';

const initialState = Map({
  alerts: List(),
  loading: Set(),
  transportationModes: List(),
  server: 'http://localhost:5000'
});

const general = (state = initialState, action) => {
    switch (action.type) {
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
        if (action.ref) {
          const index = state.get('alerts').findIndex((a) => a.ref === action.ref);
          if (index !== -1) {
            return state;
          }
        }
        return state.update('alerts', (alerts) => alerts.push({ type: action.alertType, message: action.message, duration: action.duration, ref: action.ref }));  
      case TOGGLE_REMAINING_TRACKS:
        return state.set('showRemainingTracks', !state.get('showRemainingTracks'));
      case SET_LOADING:
        return state.update('loading', (loading) => {
          const { is, ref } = action;
          if (is) {
            return loading.add(ref);
          } else {
            return loading.remove(ref);
          }
        })
      case UPDATE_CONFIG:
        return state.set('config', new Map(action.config));
      case UPDATE_SERVER:
        return state.set('server', action.server)
      default:
        return state;
    }
}

export default general;