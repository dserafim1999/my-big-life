import { 
    CLEAR_TRIPS,
    CLEAR_LOCATIONS,
    REMOVE_TRIP,
    CLEAR_CANONICAL_TRIPS,
    TOGGLE_DAY_INFO,
    ADD_TRIPS,
    ADD_CANONICAL_TRIPS,
    ADD_LOCATIONS
  } from ".";
  
  import { setAppLoading } from './general';
  
  /**
   * Adds trips to global state to be displayed.
   * 
   * @action
   * @param {Array} trips Array with track objects 
   * @returns  Action Object
   */
  export const addTrips = (trips) => ({
    trips,
    type: ADD_TRIPS
  })
  
  /**
   * Adds canonical trips to global state to be displayed.
   * 
   * @action
   * @param {Array} trips Array with canonical track objects
   * @returns Action Object
   */
  export const addCanonicalTrips = (trips) => ({
    trips,
    type: ADD_CANONICAL_TRIPS
  })
  
  /**
   * Adds canonical locations to global state to be displayed.
   * 
   * @action
   * @param {Array} locations Array with canonical location objects 
   * @returns Action Object
   */
  export const addLocations = (locations) => ({
    locations,
    type: ADD_LOCATIONS
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
          dispatch(addTrips(res.trips));
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
          dispatch(addTrips(res.trips));
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
 * Loads canonical trips and locations
 * 
 * @request
 */
 export const loadTripsAndLocations = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }

    dispatch(setAppLoading(true));
    
    const addr = getState().get('general').get('server');
    return fetch(addr + '/tripsLocations', options)
    .then((response) => response.json())
    .catch((e) => console.error(e))
    .then((res) => {
      dispatch(clearCanonicalTrips());
      dispatch(clearLocations());
      dispatch(addCanonicalTrips(res.trips));
      dispatch(addLocations(res.locations));
      dispatch(setAppLoading(false));
    });
  }
}

/**
 * Loads canonical trips
 * 
 * @request
 */
 export const loadCanonicalTrips = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }

    dispatch(setAppLoading(true));
    
    const addr = getState().get('general').get('server');
    return fetch(addr + '/canonicalTrips', options)
    .then((response) => response.json())
    .catch((e) => console.error(e))
    .then((res) => {
      dispatch(addCanonicalTrips(res.trips));
      dispatch(setAppLoading(false));
    });
  }
}

/**
 * Loads canonical locations
 * 
 * @request
 */
 export const loadLocations = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }

    dispatch(setAppLoading(true));
    
    const addr = getState().get('general').get('server');
    return fetch(addr + '/locations', options)
    .then((response) => response.json())
    .catch((e) => console.error(e))
    .then((res) => {
      dispatch(addLocations(res.locations));
      dispatch(setAppLoading(false));
    });
  }
}

/**
 * Loads all trips in database
 * 
 * @request
 */
export const loadAllTrips = () => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }

    dispatch(setAppLoading(true));

    const addr = getState().get('general').get('server');
    return fetch(addr + '/allTrips', options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((res) => {
        dispatch(addTrips(res.trips))
        dispatch(setAppLoading(false));
      });
  }
}

      