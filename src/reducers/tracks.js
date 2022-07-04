import { pointsToRecord, SegmentRecord, TrackRecord, createTrackObj } from "../records";
import segments from "./segments";
import { List, Map, fromJS } from 'immutable';
import { addTrack as addTrackAction } from '../actions/tracks';
import colors from "./colors";
import { groupBy } from "../utils";

export const addTrack = (state, action) => {
  let { name, segments, locations, transModes } = action;
  let track = createTrackObj(name, segments, locations, transModes, state.get('segments').count());

  const _track = track.track;
  const _segments = track.segments;

  state = state.setIn(['tracks', _track.get('id')], _track);
  _segments.forEach((s) => {
    state = state.setIn(['segments', s.get('id')], s)
  });

  return state;
}

const addMultipleTracks = (state, action) => {
  return action.tracks.reduce((state, track) => {
    const { segments, name } = track;
    const action = addTrackAction(segments[0], name);
    return tracks(state, action);
  }, state);
}

const toggleTrackRenaming = (state, action) => {
  let renaming = !state.get('tracks').get(action.trackId).get('renaming');

  return state.setIn(['tracks', action.trackId, 'renaming'], renaming);
}

const updateTrackName = (state, action) => {
  return state.setIn(['tracks', action.trackId, 'name'], action.name);
}

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
    const transportationModes = segments.map((s) => s.transportationModes);
    const locations = segments.map((s) => [s.locationFrom, s.locationTo]);
    const act = addTrackAction(points, name, locations, transportationModes);

    return addTrack(state, act);
}

const displayCanonicalTrips = (state, action) => {
  const { trips } = action;
  const canonicalSegments = trips.filter((trip) => trip.points.length > 1).map((trip, i) => {
    return new SegmentRecord({
      trackId: 0,
      id: trip.id,
      color: colors(i),
      points: pointsToRecord(trip.points)
    });
  });
  const canonicalTrack = new TrackRecord({
    id: 0,
    segments: new List(canonicalSegments.map((trip) => trip.id))
  });

  if (!state.get('alternate')) {
    state = state.set('alternate', state);
  }

  return state
    .set('canonical', 'trips')
    .updateIn(['history', 'past'], (past) => past.clear())
    .updateIn(['history', 'future'], (future) => future.clear())
    .updateIn(['tracks'], (tracks) => tracks.clear().set(canonicalTrack.id, canonicalTrack))
    .updateIn(['segments'], (segments) => {
      segments = segments.clear();
      return canonicalSegments.reduce((segments, segment) => {
        return segments.set(segment.id, segment);
      }, segments);
    });
}

const displayTrips = (state, action) => {
  const { trips } = action;

  if (!trips) {
    return state;
  }

  const tripsByDay = groupBy(trips, "date");
  const _tracks = [], _segments = [];

  var color = 0;
  for (const [day, trips] of Object.entries(tripsByDay)) {
    _tracks.push(new TrackRecord({
        id: day,
        segments: new List(trips.map((segment, i) => {
          return segment.id
        }))
      })
    );

    for (var i = 0 ; i < trips.length ; i++) {
      const trip = trips[i];
      _segments.push(new SegmentRecord({
        trackId: day,
        id: trip.id,
        color: colors(color),
        points: pointsToRecord(trip.points)
      }));
    }

    color++;
  }

  return state
    .updateIn(['history', 'past'], (past) => past.clear())
    .updateIn(['history', 'future'], (future) => future.clear())
    .updateIn(['tracks'], (tracks) => {
      tracks = tracks.clear(); 
      return _tracks.reduce((tracks, track) => {
        return tracks.set(track.id, track);
      }, tracks)
    })
    .updateIn(['segments'], (segments) => {
      segments = segments.clear(); 
      return _segments.reduce((segments, segment) => {
        return segments.set(segment.id, segment);
      }, segments);
    });
}

const displayCanonicalLocations = (state, action) => {
  const { trips } = action;
  const canonicalSegments = trips.map((trip, i) => {
    return new SegmentRecord({
      trackId: 0,
      id: i,
      label: trip.label,
      color: colors(i),
      points: pointsToRecord(trip.points)
    });
  })
  const canonicalTrack = new TrackRecord({
    id: 0,
    segments: new List(canonicalSegments.map((trip) => trip.id))
  });

  if (!state.get('alternate')) {
    state = state.set('alternate', state);
  }

  return state
    .set('canonical', 'locations')
    .updateIn(['history', 'past'], (past) => past.clear())
    .updateIn(['history', 'future'], (future) => future.clear())
    .updateIn(['tracks'], (tracks) => tracks.clear().set(canonicalTrack.id, canonicalTrack))
    .updateIn(['segments'], (segments) => {
      segments = segments.clear();
      return canonicalSegments.reduce((segments, segment) => {
        return segments.set(segment.id, segment);
      }, segments);
    });
}

const hideCanonical = (state, action) => {
  return state.get('alternate');
}

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

const redo = (state, action) => {
  return state.updateIn(['history', 'future'], (future) => future.pop());
}

const updateLIFE = (state, action) => {
  const { text, warning } = action;
  return state.set('LIFE', new Map({ text, warning }));
}

const resetHistory = (state, action) => {
  return state
    .updateIn(['history', 'future'], (history) => history.clear())
    .updateIn(['history', 'past'], (history) => history.clear());
}

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

const ACTION_REACTION = {
    'tracks/add': addTrack,
    'tracks/remove': removeTrack,
    'tracks/add_multiple': addMultipleTracks,
    'tracks/update_name': updateTrackName,
    'tracks/toggle_renaming': toggleTrackRenaming,
    'tracks/update_LIFE': updateLIFE,
    'tracks/display_trips': displayTrips,
    'tracks/reset_history': resetHistory,
    'tracks/remove_track_for': removeTracksFor,
    'tracks/undo': undo,
    'tracks/redo': redo,
    'tracks/canonical_trip': displayCanonicalTrips,
    'tracks/canonical_locations': displayCanonicalLocations,
    'tracks/hide_canonical': hideCanonical,
}


// Number or Infinity
const UNDO_LIMIT = 50

const initialState = fromJS({
  tracks: {},
  segments: {},
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