import { Map, List, Set } from 'immutable';
import { getInitialView, ModuleRoutes } from '../modules/ModuleRoutes';



const removeAlert  = (state, action) => {
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
}

const addAlert = (state, action) => {
  if (action.ref) {
    const index = state.get('alerts').findIndex((a) => a.ref === action.ref);
    if (index !== -1) {
      return state;
    }
  }

  return state.update('alerts', (alerts) => alerts.push({ type: action.alertType, message: action.message, duration: action.duration, ref: action.ref })); 
}

const toggleRemainingTracks = (state, action) => {
  return state.set('showRemainingTracks', !state.get('showRemainingTracks'));
}

const setLoading = (state, action) => {
  return state.update('loading', (loading) => {
    const { is, ref } = action;
    if (is) {
      return loading.add(ref);
    } else {
      return loading.remove(ref);
    }
  });
}

const updateConfig  = (state, action) => {
  return state.set('config', new Map(action.config));
}

const updateServer = (state, action) => {
  return state.set('server', action.server);
}

const updateView = (state, action) => {
  return state.set('activeView', action.view);
}

const ACTION_REACTION = {
  'general/remove_alert': removeAlert,
  'general/add_alert': addAlert,
  'general/set_loading': setLoading,
  'general/update_config': updateConfig,
  'general/update_server': updateServer,
  'general/update_view': updateView,
  'process/toggle_remaining_tracks': toggleRemainingTracks,
}

const initialState = Map({
  alerts: List(),
  loading: Set(),
  activeView: getInitialView(),
  transportationModes: List(),
  server: 'http://localhost:5000'
});

const general = (state = initialState, action) => {
  if (ACTION_REACTION[action.type]) {
    return ACTION_REACTION[action.type](state, action);
  } else {
    return state;
  }
}

export default general;