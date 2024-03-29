import { createSegmentObj } from '../records';
import { removeSegment as removeSegmentAction } from "../actions/segments";
import { List, Map } from 'immutable';
import { PointRecord } from '../records';

/**
 * Returns a Segment's start time.
 * 
 * @function
 * @param {object} segment Segment 
 * @returns Segment's start time
 */
const segmentStartTime = (segment) => {
  return segment.get('points').get(0).get('time');
}

/**
 * Returns a Segment's end time.
 * 
 * @function
 * @param {object} segment Segment 
 * @returns Segment's end time
 */
const segmentEndTime = (segment) => {
  return segment.get('points').get(-1).get('time');
}

/**
 * Updates segment bounds and metrics.
 * 
 * @param {*} state Global state 
 * @param {number} id Segment id 
 * @returns 
 */
const updateSegment = (state, id) => {
  return state.updateIn(['segments', id], (segment) =>
    segment
      .computeBounds()
      .computeMetrics()
  );
}

/**
 * Move segment point's position.
 */
const changeSegmentPoint = (state, action) => {
  const id = action.segmentId;

  const pp = state.get('segments').get(id).get('points').get(action.index);
  const oLon = pp.get('lon');
  const oLat = pp.get('lat');

  state = state.setIn(['segments', id, 'points', action.index, 'lat'], action.lat);
  state = state.setIn(['segments', id, 'points', action.index, 'lon'], action.lon);
  
  action.undo = (self, state) => {
    const id = self.segmentId;
    state = state.setIn(['segments', id, 'points', self.index, 'lat'], oLat);
    state = state.setIn(['segments', id, 'points', self.index, 'lon'], oLon);
    return updateSegment(state, id);
  }

  return state;
}

/**
 * Remove point from segment.
 */
const removeSegmentPoint = (state, action) => {
  const id = action.segmentId;
  const point = state.get('segments').get(id).get('points').get(action.index);

  action.undo = (self, state) => {
    return updateSegment(state.updateIn(['segments', self.segmentId, 'points'], (points) => points.insert(self.index, point)), id);
  }

  return state.deleteIn(['segments', id, 'points', action.index]);
}

/**
 * Adds a new point to the end of a segment.
 */    
const extendSegment = (state, action) => {
    const id = action.segmentId;
    
    // when extending segment, adding points at the beggining or the end, the time will be interpolated using the delta time between the last two or next two points
    const extrapolateTime = (points, n) => {
        if (n === 0) {
            let prev = points.get(0).get('time');
            let next = points.get(1).get('time');
            let prediction = prev.clone().subtract(prev.diff(next));
            return prediction;
        } else {
            let prev = points.get(-1).get('time');
            let next = points.get(-2).get('time');
            let prediction = prev.clone().add(prev.diff(next));
            return prediction;
        }
    }

    const points = state.get('segments').get(id).get('points');

    let point = new PointRecord({
      lat: action.lat,
      lon: action.lon,
      time: points.get(0).get('time') ? (
        points.count() === 1 ? points.get(0).get('time').clone().add(1000) : extrapolateTime(points, action.index)
      ) : null
    });
 
    return state.updateIn(['segments', id, 'points'], (points) => {
      if (action.index === 0) {
        action.undo = (self, state) => {
          updateSegment(state.updateIn(['segments', id, 'points'], (points) => points.remove(0)), id)
        }
        return points.unshift(point);
      } else {
        action.undo = (self, state) => {
          updateSegment(state.updateIn(['segments', id, 'points'], (points) => points.pop()), id)
        }
        return points.push(point);
      }
    });
}

/**
 * Add a point to a segment.
 */
const addSegmentPoint = (state, action) => {
    const id = action.segmentId;

    // when adding a point between two other points the time is interpolated is the difference between the two points halved.
    const extrapolateTime = (points, n) => {
        if (!points.get(n).get('time')) {
          return null;
        }
        let prev = points.get(n - 1).get('time');
        let next = points.get(n).get('time');
        let diff = next.diff(prev) / 2;
        return prev.clone().add(diff);
    }

    let point = {
        lat: action.lat,
        lon: action.lon,
        time: extrapolateTime(state.get('segments').get(id).get('points'), action.index)
    }

    action.undo = (self, state) => {
      return updateSegment(state.updateIn(['segments', id, 'points'], (points) => points.remove(action.index)), id)
    }

    return state.updateIn(['segments', id, 'points'], (points) => {
      return points.insert(action.index, new PointRecord(point));
    });
}

/**
 * Removes segment from list of segments.
 */
const removeSegment = (state, action) => {
    const id = action.segmentId;
    const trackId = state.get('segments').get(id).get('trackId');

    const segment = state.get('segments').get(id);
    const track = state.get('tracks').get(trackId);

    state = state.deleteIn(['segments', action.segmentId]);
    if (state.get('tracks').get(trackId).get('segments').count() === 1) {
      state = state.deleteIn(['tracks', trackId]);
      action.undo = (self, state) => {
        return state
        .setIn(['segments', id], segment)
        .setIn(['tracks', trackId], track);
      }
    } else {
      state = state.updateIn(['tracks', trackId, 'segments'], (segments) => {
        return segments.delete(id);
      });
      action.undo = (self, state) => {
        return state
          .updateIn(['tracks', trackId, 'segments'], (segments) => segments.add(id))
          .setIn(['segments', id], segment);
      }
    }
    return state;
}

/**
 * Splits a segment into two on the point with the provided index.
 */
const splitSegment = (state, action) => {
    const id = action.segmentId;
    const segment = state.get('segments').get(id);
    let _points = segment.get('points');
    const newSegment = _points.slice(action.index, _points.count());

    
    state = state.updateIn(['segments', id, 'points'], (points) => {
      return points.slice(0, action.index + 1);
    })
    
    state = updateSegment(state, id);

    const segData = createSegmentObj(segment.get('trackId'), newSegment.toJS(), [], state.get('segments').count());
    state = state.setIn(['segments', segData.get('id')], segData);

    let newSegmentId;
    state = state.updateIn(['tracks', segment.get('trackId'), 'segments'], (segments) => {
      newSegmentId = segData.get('id');
      return segments.add(newSegmentId);
    });

    action.undo = (self, state) => {
      state = state.updateIn(['segments', id, 'points'], (points) => {
        const rest = state.get('segments').get(newSegmentId).get('points');
        return points.push(...rest.slice(1));
      })
      .deleteIn(['segments', newSegmentId])
      .updateIn(['tracks', state.get('segments').get(id).get('trackId'), 'segments'], (segs) => {
        return segs.delete(newSegmentId);
      })
      state = updateSegment(state, id);

      action.forceId = newSegmentId;
      action.hasDoneUndo = true;
      return state;
    }

    if (action.hasDoneUndo) {
      action.hasDoneUndo = false;
      return state;
    } else {
      return toggleSegmentProp(state, id, 'splitting', false);
    }
}

/**
 * Joins two segments together into one.
 */
const joinSegment = (state, action) => {
  const { details } = action;
  const union = details.union[action.index];
  let toRemove = state.get('segments').get(details.segment);

  const isEqual = (pa, pb) => pa.get('lat') === pb.get('lat') && pa.get('lon') === pb.get('lon') && pa.get('time').isSame(pb.get('time'));
  
  state = state.updateIn(['segments', action.segmentId, 'points'], (points) => {
    const removeEnd = union.length === 2 && isEqual(union[0], union[1]);
    const betweeners = union.slice(1, -1);
    
    if (points.get(-1) === union[0]) {
      // Join end of this with the start of the other segment
      toRemove = (removeEnd ? toRemove.get('points').rest() : toRemove.get('points'));

      const betwLen = betweeners.length;
      const pointsCount = points.count();
      action.undo = (self, state) => {
        const splitPoint = pointsCount - 1;
        const otherSegmentPoints = state.get('segments').get(action.segmentId).get('points').slice(splitPoint + betwLen + (removeEnd ? 0 : 1));
        state = state.updateIn(['segments', action.segmentId, 'points'], (points) => {
          return points.slice(0, splitPoint + 1)
        })
        const trackId = state.get('segments').get(action.segmentId).get('trackId');
        const lastSeg = createSegmentObj(trackId, otherSegmentPoints.toJS(), [], state.get('segments').count(), details.segment);
        state = state.setIn(['segments', details.segment], lastSeg);
        state = updateSegment(state, details.segment);
        state = updateSegment(state, action.segmentId);
        state = state.updateIn(['tracks', trackId, 'segments'], (sgs) => sgs.add(details.segment));
        return state;
      }

      const startTime = union[0].get('time');
      const endTime = union[union.length - 1].get('time');
      const timeDiff = endTime.diff(startTime);
      const n = betweeners.length + 1;
      const dtPP = timeDiff / n;

      return points
        .push(...betweeners.map((point, i) => {
          return point.set('time', startTime.clone().add(dtPP * (i + 1)))
        }))
        .push(...toRemove);
    } else {
      // Join start of this with the end of the other segment
      toRemove = (removeEnd ? toRemove.get('points').butLast() : toRemove.get('points'));

      const betwLen = betweeners.length;
      const pointsCount = toRemove.count();
      action.undo = (self, state) => {
        const splitPoint = pointsCount;
        const otherSegmentPoints = state.get('segments').get(action.segmentId).get('points').slice(0, splitPoint + (removeEnd ? 1 : 0));
        state = state.updateIn(['segments', action.segmentId, 'points'], (points) => {
          return points.slice(betwLen + splitPoint)
        })
        const trackId = state.get('segments').get(action.segmentId).get('trackId');
        const lastSeg = createSegmentObj(trackId, otherSegmentPoints.toJS(), [], state.get('segments').count(), details.segment);
        state = state.setIn(['segments', details.segment], lastSeg);
        state = updateSegment(state, details.segment);
        state = updateSegment(state, action.segmentId);
        state = state.updateIn(['tracks', trackId, 'segments'], (sgs) => sgs.add(details.segment));
        return state;
      }

      const startTime = union[union.length - 1].get('time');
      const endTime = union[0].get('time');
      const timeDiff = endTime.diff(startTime);
      const n = betweeners.length + 1;
      const dtPP = timeDiff / n;

      let revBetweeners = [];
      betweeners.forEach((p) => revBetweeners.unshift(p));

      return points
        .unshift(...revBetweeners.map((point, i) => {
          return point.set('time', startTime.clone().add(dtPP * (i + 1)))
        }))
        .unshift(...toRemove);
    }
  });

  state = toggleSegmentProp(state, action.segmentId, 'joining', false);
  state = segments(state, removeSegmentAction(details.segment));

  return updateSegment(state, action.segmentId);
}

/**
 * Updates segment time filter.
 */
const updateTimeFilterSegment = (state, action) => {
  return state.updateIn(['segments', action.segmentId, 'timeFilter'], (f) => {
    return f.set(0, action.lower).set(1, action.upper);
  });
}

/**
 * Toggle whether segment's time filter is active.
 */
const toggleTimeFilter = (state, action) => {
  return state.updateIn(['segments', action.segmentId, 'showTimeFilter'], (f) => {
    return !f;
  });
}

/**
 * Sets prop as true and false to others, in order to indicate the active mode
 * 
 * @function
 * @param {*} state Globa state
 * @param {number} id Segment id 
 * @param {string} prop  Mode to toggle
 * @param {boolean} force Boolean value to force instead of toggling 
 */
const toggleSegmentProp = (state, id, prop, force) => {
  return state
    .updateIn(['segments', id], (seg) => seg.toggleMode(prop, force));
}    

/**
 * Toggle whether segment is visible.
 */
const toggleSegmentVisibility = (state, action) => {
    const id = action.segmentId;
    state = toggleSegmentProp(state, id, 'display', action.value);
    return state.setIn(['segments', id, 'display'], state.get('segments').get(id).get('display'));
}

/**
 * Toggle whether segment is in edit mode.
 */
const toggleSegmentEditing = (state, action) => {
  const id = action.segmentId;

  if (state.get('segments').get(id).get('editing')) {
    state = updateSegment(state, id);
    state = state.setIn(['segments', id, 'selectedPoints'], new List());
  }

  return toggleSegmentProp(state, id, 'editing');
}

/**
 * Toggle whether segment is in split mode.
 */
const toggleSegmentSplitting = (state, action) => {
  const id = action.segmentId;

  return toggleSegmentProp(state, id, 'splitting');
}

/**
 * Toggle whether segment is in point details mode.
 */
const toggleSegmentPointDetails = (state, action) => {
  const id = action.segmentId;

  return toggleSegmentProp(state, id, 'pointDetails');
}

/**
 * Toggle whether segment is in join mode.
 */
const toggleSegmentJoining = function (state, action) {
  var id = action.segmentId;
  var segment = state.get('segments').get(id);
  var trackId = segment.get('trackId');
  var track = state.get('tracks').get(trackId);

  var segments = track.get('segments').count();
  if (segments > 1) {
    var candidates = track.get('segments').toJS();
    candidates.splice(candidates.indexOf(id), 1);

    var thisStartp = segment.get('points').get(0);
    var thisEndp = segment.get('points').get(-1);

    const segs = track.get('segments').toList()
      .map((ts) => state.get('segments').get(ts))
      .sort((a, b) => segmentStartTime(a).diff(segmentStartTime(b)));

    const idIndex = segs.findIndex((elm) => {
      return elm.get('id') === id
    });

    const cs = segs.slice(0, idIndex);
    const ce = segs.slice(idIndex + 1, segs.count());

    const closerToStart = cs.get(-1);
    const closerToEnd = ce.get(0);

    var possibilities = [];
    const DEFAULT_WEIGHT = 0.5;
    if (closerToStart !== undefined) {
      possibilities.push({
        segment: closerToStart.get('id'),
        union: [[thisStartp, closerToStart.get('points').get(-1)]],
        weights: [DEFAULT_WEIGHT],
        destiny: 'END',
        show: 'END'
      });
    }
    if (closerToEnd !== undefined) {
      possibilities.push({
        segment: closerToEnd.get('id'),
        union: [[thisEndp, closerToEnd.get('points').get(0)]],
        weights: [DEFAULT_WEIGHT],
        destiny: 'START',
        show: 'START'
      });
    }

    state = state.setIn(['segments', id, 'joinPossible'], possibilities);
    
    state = toggleSegmentProp(state, action.segmentId, 'joining');
  } else {
      throw new Error('There are no segments that can be joined');
  }

  return state;
}

/**
 * Add trip completion possibilities.
 */
const addPossibilities = (state, action) => {
  return state.updateIn(['segments', action.segmentId, 'joinPossible'], (arr) => {
    const points = action.points.map((point) => {
      return Map({ lat: point[0], lon: point[1] });
    });

    const ends = arr[action.index].union[0];
    points[0] = ends[0];
    points[points.length - 1] = ends[1];

    arr[action.index].union.push(points);
    arr[action.index].weights.push(action.weight);
    return [...arr];
  });
}

/** TODO */
const updateLocationName = (state, action) => {
  const { segmentId, start, name } = action;
  const locationIndex = start ? 0 : 1;
  return state.setIn(['segments', segmentId, 'locations', locationIndex, 'label'], name);
}

/**
 * Add point to selected points list.
 */
const selectPoint = (state, action) => {
  const { segmentId, point } = action;

  return state.updateIn(['segments', segmentId, 'selectedPoints'], (points) => {
    if (!points || points.count() === 0) {
      return new List([point]);
    } else {
      if (points.get(0) === point) {
        if (points.count() === 1) {
          return points.clear();
        } else {
          return points.delete(1);
        }
      } else {
        return points.set(1, point);
      }
    }
  })
}

/**
 * Remove point from selected points list.
 */
const deselectPoint = (state, action) => {
  const { segmentId, point } = action;
  if (point) {
    return state.updateIn(['segments', segmentId, 'selectedPoints'], (points) => {
      return points.delete(points.indexOf(points));
    })
  } else {
    return state.setIn(['segments', segmentId, 'selectedPoints'], new List());
  }
}

/**
 * TODO
 * @param {object} a  
 * @param {object} b 
 * @param {object} p 
 * @returns 
 */
const closestPointOnLineSegment = (a, b, p) => {
  const ap = { lat: p.lat - a.lat, lon: p.lon - a.lon };
  const ab = { lat: b.lat - a.lat, lon: b.lon - a.lon };

  const magAB = ab.lat * ab.lat + ab.lon * ab.lon;
  const abapProduct = ab.lat * ap.lat + ab.lon * ap.lon;
  const distance = abapProduct / magAB;

  if (distance < 0) {
    return a;
  } else if (distance > 1) {
    return b;
  } else {
    return {
      lat: a.lat + ab.lat * distance,
      lon: a.lon + ab.lon * distance
    }
  }
}

/**
 * Straightens segment portion containing selected points.
 */
const straightSelected = (state, action) => {
  const { segmentId } = action;
  const selected = state.get('segments').get(segmentId).get('selectedPoints').sort();
  const pts = state.get('segments').get(segmentId).get('points');

  const startIndex = selected.get(0);
  const endIndex = selected.get(-1);
  const start = pts.get(startIndex).toJS();
  const end = pts.get(endIndex).toJS();

  return state.updateIn(['segments', segmentId, 'points'], (points) => {
    for (let i = startIndex; i < endIndex; i++) {
      points = points.update(i, (p) => {
        const closest = closestPointOnLineSegment(start, end, p.toJS());
        return p
          .set('lat', closest.lat)
          .set('lon', closest.lon);
      });
    }
    return points;
  })
}

/**
 * Edit point location and date.
 */
const updatePoint = (state, action) => {
  const { segmentId, index, lat, lon, time } = action;
  return state.updateIn(['segments', segmentId, 'points', index], (point) => {
    return point
      .set('lat', lat)
      .set('lon', lon)
      .set('time', time)
  });
}

/**
 * Adds new segment to track.
 */
const addSegment = (state, action) => {
  const { trackId, point } = action;
  const seg = createSegmentObj(trackId, [point]);
  return state
    .setIn(['segments', seg.get('id')], seg)
    .updateIn(['tracks', trackId, 'segments'], (segs) => segs.add(seg.get('id')));
}

const ACTION_REACTION = {
    'segments/toggle_visibility': toggleSegmentVisibility,
    'segments/toggle_edit': toggleSegmentEditing,
    'segments/toggle_split': toggleSegmentSplitting,
    'segments/toggle_join': toggleSegmentJoining,
    'segments/toggle_point_details': toggleSegmentPointDetails,
    'segments/toggle_time_filter': toggleTimeFilter,
 
    'segments/change_point': changeSegmentPoint,
    'segments/remove_point': removeSegmentPoint,
    'segments/add_point': addSegmentPoint,
 
    'segments/extend': extendSegment,
    'segments/remove': removeSegment,
    'segments/split': splitSegment,
    'segments/join': joinSegment,
    'segments/add_possibilities': addPossibilities,
    'segments/time_filter': updateTimeFilterSegment,

    'segments/update_location_name': updateLocationName,
    'segments/select_point': selectPoint,
    'segments/deselect_point': deselectPoint,

    'segments/straight_selected': straightSelected,
    'segments/update_point': updatePoint,
    'segments/add': addSegment
}

const segments = (state = [], action) => {
    if (ACTION_REACTION[action.type]) {
      return ACTION_REACTION[action.type](state, action);
    } else {
      return state;
    }
}

export default segments;