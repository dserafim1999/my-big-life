import { 
    DISPLAY_TRIPS,
    DISPLAY_LOCATIONS,
    DISPLAY_CANONICAL_TRIPS,
    CLEAR_TRIPS,
    CLEAR_LOCATIONS,
    REMOVE_TRIP,
    CLEAR_CANONICAL_TRIPS,
    UPDATE_ACTIVE_LIFE,
    TOGGLE_DAY_INFO
  } from ".";
  
  import { getLifeFromDay, setAppLoading } from './general';
  
  /**
   * Adds trips to global state to be displayed.
   * 
   * @action
   * @param {Array} trips Array with track objects 
   * @returns  Action Object
   */
  export const displayTrips = (trips) => ({
    trips,
    type: DISPLAY_TRIPS
  })
  
  /**
   * Adds canonical trips to global state to be displayed.
   * 
   * @action
   * @param {Array} trips Array with canonical track objects
   * @returns Action Object
   */
  export const displayCanonicalTrips = (trips) => ({
    trips,
    type: DISPLAY_CANONICAL_TRIPS
  })
  
  /**
   * Adds canonical locations to global state to be displayed.
   * 
   * @action
   * @param {Array} locations Array with canonical location objects 
   * @returns Action Object
   */
  export const displayLocations = (locations) => ({
    locations,
    type: DISPLAY_LOCATIONS
  })
  
  /**
   * Remove a trip from the global state.
   * 
   * @action
   * @param {string} tripId Trip Id 
   * @returns Action Object
   */
   export const removeTrip = (tripId) => ({
    tripId,
    type: REMOVE_TRIP
  })
  
  /**
   * Remove all trips from state.
   * 
   * @function
   * @returns Action Object
   */
  export const clearTrips = () => {
    return (dispatch, getState) => {
      dispatch(toggleDayInfo(false));
      dispatch({type: CLEAR_TRIPS});
    }
  }

  /**
   * Remove all tracks/segments from state.
   * 
   * @function
   * @returns Action Object
   */
   export const clearCanonicalTrips = () => {
    return (dispatch, getState) => {
      dispatch({type: CLEAR_CANONICAL_TRIPS});
    }
  }
  
  /**
   * Remove canonical locations from state.
   * 
   * @action
   * @returns Action Object
   */
  export const clearLocations = () => ({
    type: CLEAR_LOCATIONS
  })

  /**
   * Loads trips contained in certain bounds.
   * 
   * @request
   * @param {number} latMin Minimum bounds latitude
   * @param {number} lonMin Minimum bounds longitude
   * @param {number} latMax Maximum bounds latitude
   * @param {number} lonMax Maximum bounds longitude
   * @param {boolean} canonical If trips are canonical 
   */
  export const loadTripsInBounds = (latMin, lonMin, latMax, lonMax, canonical) => {
    return (dispatch, getState) => {
      const options = {
        method: 'GET',
        mode: 'cors'
      }
  
      dispatch(setAppLoading(true));
  
      const addr = getState().get('general').get('server');
      return fetch(addr + '/trips?latMin=' + latMin + '&lonMin=' + lonMin + '&latMax=' + latMax + '&lonMax=' + lonMax + '&canonical=' + canonical, options)
        .then((response) => response.json())
        .catch((e) => console.error(e))
        .then((res) => {
          dispatch(clearTrips());
          dispatch(displayTrips(res.trips));
          dispatch(setAppLoading(false));
        });
    }
  }
  
  /**
   * Loads another load of trips contained in certain bounds.
   * 
   * @request
   * @param {number} latMin Minimum bounds latitude
   * @param {number} lonMin Minimum bounds longitude
   * @param {number} latMax Maximum bounds latitude
   * @param {number} lonMax Maximum bounds longitude
   * @param {boolean} canonical If trips are canonical 
   */
  export const loadMoreTripsInBounds = (latMin, lonMin, latMax, lonMax, canonical) => {
    return (dispatch, getState) => {
      const options = {
        method: 'GET',
        mode: 'cors'
      }
  
      dispatch(setAppLoading(true));
  
      const addr = getState().get('general').get('server');
  
      return fetch(addr + '/moreTrips?latMin=' + latMin + '&lonMin=' + lonMin + '&latMax=' + latMax + '&lonMax=' + lonMax + '&canonical=' + canonical, options)
        .then((response) => response.json())
        .catch((e) => console.error(e))
        .then((res) => {
          dispatch(displayTrips(res.trips));
          dispatch(setAppLoading(false));
        });
    }
  }
  
  /**
   * Determines if certain bounds require more loading of trips.
   * 
   * If all trips in bounds have been loading, then no loading is required.
   * 
   * @request
   * @param {number} latMin Minimum bounds latitude
   * @param {number} lonMin Minimum bounds longitude
   * @param {number} latMax Maximum bounds latitude
   * @param {number} lonMax Maximum bounds longitude
   * @param {boolean} canonical If trips are canonical 
   */
  export const canLoadMoreTripsInBounds = (latMin, lonMin, latMax, lonMax, canonical) => {
    return (dispatch, getState) => {
      const options = {
        method: 'GET',
        mode: 'cors'
      }
  
      const addr = getState().get('general').get('server');
  
      return fetch(addr + '/hasMoreTrips?latMin=' + latMin + '&lonMin=' + lonMin + '&latMax=' + latMax + '&lonMax=' + lonMax + '&canonical=' + canonical, options)
        .then((response) => response.json())
        .catch((e) => console.error(e))
        .then((res) => {
          if (res) {
            dispatch(loadMoreTripsInBounds(latMin, lonMin, latMax, lonMax, canonical))
          }
        });
    }
  }

/**
 * Update active day's LIFE string in state.
 * 
 * @action
 * @param {string} life Segment LIFE representation 
 * @returns Action Object
 */
export const updateActiveLIFE = (life) => ({
  life,
  type: UPDATE_ACTIVE_LIFE
})

/**
 * Toggle panel with information about day.
 * 
 * @action
 * @param {boolean} value If panel is active
 * @param {Date} date Day to observe 
 * @returns Action Object 
 */
 export const toggleDayInfo = (value = undefined, date = undefined) => {
  return (dispatch, getState) => {
    console.log(date)
    if (date) dispatch(getLifeFromDay(date.format('YYYY-MM-DD')));
    dispatch({
      value,
      date, 
      type: TOGGLE_DAY_INFO
    });
  }
}
      