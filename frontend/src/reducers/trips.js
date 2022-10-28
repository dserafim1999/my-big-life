import colors from "../utils/colors";
import moment from 'moment';

import { PointRecord } from "../records";
import { fromJS } from 'immutable';
import { groupBy } from "../utils";

/**
 * Adds trips to global state to be displayed.
 */
const addTrips = (state, action) => {
  const { trips } = action;

  if (!trips) {
    return state;
  }

  const tripsByDay = groupBy(trips, "id");
  const _trips = []

  var color = 0;
  for (const [day, trips] of Object.entries(tripsByDay)) {
    const _color = colors(color++);
    _trips.push({id: moment(day).format('YYYY-MM-DD'), trips: trips, color: _color, display: true})
  }

  return state
    .updateIn(['trips'], (trips) => {
      return _trips.reduce((trips, trip) => {
        return trips.set(trip.id, trip);
      }, trips)});
}

/**
 * Adds canonical trips to global state to be displayed.
 */
const addCanonicalTrips = (state, action) => {
  const { trips } = action;

  if (!trips) {
    return state;
  }

  const _trips = [];

  for (var i = 0 ; i < trips.length ; i++) {
    const trip = trips[i];
    _trips.push({id: trip.id, geoJSON: trip.geoJSON, color: 'var(--main)'});
  }

  return state
    .updateIn(['canonicalTrips'], (trips) => {
      trips = trips.clear();
      return _trips.reduce((trips, trip) => {
        return trips.set(trip.id, trip);
      }, trips);
    });
}

/**
 * Adds canonical locations to global state to be displayed.
 */
const addLocations = (state, action) => {
  const { locations } = action;
  const _points = [];

  for (const [i, location] of Object.entries(locations)) {
    _points.push(new PointRecord({
        lat: location.geoJSON.coordinates[1],
        lon: location.geoJSON.coordinates[0],
        label: location.label
      })
    );
  }
  
  return state
    .updateIn(['locations'], (locations) => {
      locations = locations.clear(); 
      return _points.reduce((locations, location) => {
        return locations.set(location.label, location);
      }, locations)
    });
}

/**
 * Remove a trip from the global state.
 */
 const removeTrip = (state, action) => {
  const { tripId } = action;

  return state.deleteIn(['trips', tripId]);
}

/**
 * Remove all canonical locations from state.
 */
const clearLocations = (state, action) => {
  return state.setIn(["locations"], fromJS({}));
}

/**
 * Remove all trips from state.
 */
const clearTrips = (state, action) => {
  return state.setIn(["trips"], fromJS({}));
}

/**
 * Remove all canonical trips from state.
 */
const clearCanonicalTrips = (state, action) => {
  return state.setIn(["canonicalTrips"], fromJS({}));
}


const ACTION_REACTION = {
    'trips/remove': removeTrip,
    'trips/add': addTrips,
    'trips/add_canonical': addCanonicalTrips,
    'trips/add_locations': addLocations,
    'trips/clear': clearTrips,
    'trips/clear_canonical': clearCanonicalTrips,
    'trips/clear_locations': clearLocations
}

const initialState = fromJS({
  locations: {},
  trips: {},
  canonicalTrips: {}
});

const trips = (state = initialState, action) => {
    if (ACTION_REACTION[action.type]) {
        return ACTION_REACTION[action.type](state, action);
    } else {
        return state;
    }
}

export default trips;