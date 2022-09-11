import segments from "./segments";
import colors from "../utils/colors";
import moment from 'moment';

import { pointsToRecord, SegmentRecord, createTrackObj, PointRecord } from "../records";
import { Map, fromJS } from 'immutable';
import { addTrack as addTrackAction } from '../actions/tracks';
import { groupBy } from "../utils";

/**
 * Adds track to global state.
 */
export const addTrack = (state, action) => {
  let { name, segments, locations } = action;
  let track = createTrackObj(name, segments, locations, state.get('segments').count());

  const _track = track.track;
  const _segments = track.segments;

  state = state.setIn(['tracks', _track.get('id')], _track);
  _segments.forEach((s) => {
    state = state.setIn(['segments', s.get('id')], s)
  });

  return state;
}

/**
 * Add multiple tracks to global state.
 * 
 * See `addTrack `.
 */
const addMultipleTracks = (state, action) => {
  return action.tracks.reduce((state, track) => {
    const { segments, name } = track;
    const action = addTrackAction(segments[0], name);
    return tracks(state, action);
  }, state);
}

/**
 * Updates current day tracks based on server state changes
 */
const removeTracksFor = (state, action) => {
  state = state
    .updateIn(['tracks'], (tracks) => {
      return tracks.clear()
    })
    .updateIn(['segments'], (segments) => {
      return segments.clear()
    });

    const { segments, name } = action;
    const points = segments.map((s) => s.points);
    const locations = segments.map((s) => [s.locationFrom, s.locationTo]);
    const act = addTrackAction(points, name, locations);

    return addTrack(state, act);
}

/**
 * Adds trips to global state to be displayed.
 */
const displayTrips = (state, action) => {
  const { trips } = action;

  if (!trips) {
    return state;
  }

  const tripsByDay = groupBy(trips, "id");
  const _tracks = []

  var color = 0;
  for (const [day, trips] of Object.entries(tripsByDay)) {
    const _color = colors(color++);
    _tracks.push({id: moment(day).format('YYYY-MM-DD'), trips: trips, color: _color})
  }

  return state
    .updateIn(['tracks'], (tracks) => {
      // tracks = tracks.clear();
      return _tracks.reduce((tracks, track) => {
        return tracks.set(track.id, track);
      }, tracks)});
}

/**
 * Adds canonical trips to global state to be displayed.
 */
const displayCanonicalTrips = (state, action) => {
  const { trips } = action;

  if (!trips) {
    return state;
  }

  const _segments = [];

  var color = 0;
  for (var i = 0 ; i < trips.length ; i++) {
    const trip = trips[i];
    _segments.push(new SegmentRecord({
      trackId: i,
      id: trip.id,
      color: 'rgb(233,62,58)',
      points: pointsToRecord(trip.points)
    }));
  }

  return state
    .updateIn(['canonicalTrips'], (segments) => {
      segments = segments.clear();
      return _segments.reduce((segments, segment) => {
        return segments.set(segment.id, segment);
      }, segments);
    });
}

/**
 * Adds canonical locations to global state to be displayed.
 */
const displayLocations = (state, action) => {
  const { locations } = action;
  const _points = [];

  for (const [i, location] of Object.entries(locations)) {
    _points.push(new PointRecord({
        lat: location.lat,
        lon: location.lon,
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
 * Undo changes to track
 */
const undo = (state, action) => {
  let toPut = state.get('history').get('past').get(-1);
  if (toPut) {
    return toPut.undo(toPut, state)
    .updateIn(['history', 'past'], (past) => past.pop())
    .updateIn(['history', 'future'], (future) => {
      future = future.push(toPut);
      if (UNDO_LIMIT !== Infinity) {
        return future.slice(future.count() - UNDO_LIMIT);
      } else {
        return future;
      }
    })
  } else {
    return state;
  }
}

/**
 * Redo changes to track
 */
const redo = (state, action) => {
  return state.updateIn(['history', 'future'], (future) => future.pop());
}

/**
 * Updates the LIFE representation of a track.
 */
const updateTrackLIFE = (state, action) => {
  const { text, warning } = action;
  return state.set('LIFE', new Map({ text, warning }));
}

/**
 * Reset history of changes to track
 */
const resetHistory = (state, action) => {
  return state
    .updateIn(['history', 'future'], (history) => history.clear())
    .updateIn(['history', 'past'], (history) => history.clear());
}

/**
 * Remove a track from the global state.
 */
const removeTrack = (state, action) => {
  const { trackId } = action;

  action.undo = (self, newState) => {
    return state;
  }

  let cState = state;
  state.get('tracks').get(trackId).get('segments').forEach((seg) => {
    cState = cState.deleteIn(['segments', seg]);
  })
  return cState.deleteIn(['tracks', trackId]);
}

/**
 * Remove canonical locations from state.
 */
const clearLocations = (state, action) => {
  return state.setIn(["locations"], fromJS({}));
}

/**
 * Remove all tracks/segments from state.
 */
const clearTrips = (state, action) => {
  return state
    .setIn(["tracks"], fromJS({}))
    .setIn(["segments"], fromJS({}));
}

/**
 * Remove all tracks/segments and canonical trips/locations from state.
 */
const clearAll = (state, action) => {
  return initialState;
}

const ACTION_REACTION = {
    'tracks/add': addTrack,
    'tracks/remove': removeTrack,
    'tracks/add_multiple': addMultipleTracks,
    'tracks/update_LIFE': updateTrackLIFE,
    'tracks/display_trips': displayTrips,
    'tracks/display_canonical_trips': displayCanonicalTrips,
    'tracks/display_locations': displayLocations,
    'tracks/reset_history': resetHistory,
    'tracks/remove_track_for': removeTracksFor,
    'tracks/clear_all': clearAll,
    'tracks/clear_trips': clearTrips,
    'tracks/clear_locations': clearLocations,
    'tracks/undo': undo,
    'tracks/redo': redo,
}


// Number or Infinity
const UNDO_LIMIT = 50

const initialState = fromJS({
  tracks: {},
  locations: {},
  segments: {},
  canonicalTrips: {},
  history: {
    past: [],
    future: []
  }
});

const tracks = (state = initialState, action) => {
  let result;  
  if (ACTION_REACTION[action.type]) {
      result = ACTION_REACTION[action.type](state, action);
  } else {
      result = segments(state, action);
  }
  if (result !== state && action.undo) {
      return result.updateIn(['history', 'past'], (past) => {
        past = past.push(action)
        if (UNDO_LIMIT !== Infinity) {
          return past.slice(past.count() - UNDO_LIMIT);
        } else {
          return past;
        }
      });
  } else {
      return result;
  }
}

export default tracks;