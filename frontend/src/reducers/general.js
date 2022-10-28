import { Map, List, Set } from 'immutable';
import { getActiveView } from '../modules/ModuleRoutes';

/**
 * Adds an alert to the alert queue
 */
const addAlert = (state, action) => {
  if (action.ref) {
    const index = state.get('alerts').findIndex((a) => a.ref === action.ref);
    if (index !== -1) {
      return state;
    }
  }

  return state.update('alerts', (alerts) => alerts.push({ type: action.alertType, message: action.message, duration: action.duration, ref: action.ref })); 
}

/**
 * Removes an alert from the alert queue
 */
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

/**
 * Adds/Removes Loading status with certain identifier.
 * 
 * Used to indicate if some operation is in process in order to add loading behaviour to component.
 */
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

/**
 * Sets whether the app should load globally or not.
 * 
 * Used to set `LoadingOverlay` over the application.
 */
const setAppLoading = (state, action) => {
  return state.set('isAppLoading', action.isLoading);
}

/**
 * Updates global configurations.
 */
const updateConfig  = (state, action) => {
  return state.set('config', new Map(action.config));
}

/**
 * Updates server address
 */
const updateServer = (state, action) => {
  return state.set('server', action.server);
}

/**
 * Updates the current active view in the application
 */
const updateView = (state, action) => {
  return state.set('activeView', action.view);
}

/**
 * Toggles UI visibility 
 */
const toggleUI = (state, action) => {
  return state.set('isUIVisible', action.isVisible);
}

/**
 * Updates global LIFE file
 */
const setGlobalLIFE = (state, action) => {
  return state.set('LIFE', action.life);
}

/**
 * Delete day from global LIFE file
 */
 const removeDayFromGlobalLIFE = (state, action) => {
  return state.updateIn(['LIFE', 'days'], (days) => {
    return days.filter((day) => day.date !== action.date);  
  });
}

/**
 * Updates current selected day
 */
 const setSelectedDay = (state, action) => {
  return state
    .set('selectedDay', action.date ? action.date : null)
    .set('selectedDayColor', action.color);
}

/** 
 * Sets whether Change Day menu is active in Track Processing Module. 
 * 
 * If no boolean value is set, value is toggled.
 */
const toggleRemainingTracks = (state, action) => {
  return state.set('showRemainingTracks', action.value !== undefined ? action.value : !state.get('showRemainingTracks'));
}

const ACTION_REACTION = {
  'general/remove_alert': removeAlert,
  'general/add_alert': addAlert,
  'general/set_loading': setLoading,
  'general/set_app_loading': setAppLoading,
  'general/update_config': updateConfig,
  'general/update_server': updateServer,
  'general/update_view': updateView,
  'general/set_LIFE': setGlobalLIFE,
  'general/remove_day_from_LIFE': removeDayFromGlobalLIFE,
  'general/set_selected_day': setSelectedDay,
  'general/toggle_ui': toggleUI,
  'process/toggle_remaining_tracks': toggleRemainingTracks,
}

const initialState = Map({
  alerts: List(),
  loading: Set(),
  activeView: getActiveView(),
  selectedDayColor: 'lightgrey',
  isUIVisible: true,
  isAppLoading: false,
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