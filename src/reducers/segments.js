import {
  createSegmentObj,
} from '../records';
import { removeSegment as removeSegmentAction } from "../actions/segments";
import { Set, List, Map, fromJS } from 'immutable';
import { PointRecord } from '../records';
import moment from 'moment';

const segmentStartTime = (segment) => {
  return segment.get('points').get(0).get('time');
}

const segmentEndTime = (segment) => {
  return segment.get('points').get(-1).get('time');
}

// TODO compute metrics
const updateSegment = (state, id) => {
    return state;
}

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

const removeSegmentPoint = (state, action) => {
  const id = action.segmentId;
  const point = state.get('segments').get(id).get('points').get(action.index);

  action.undo = (self, state) => {
    return updateSegment(state.updateIn(['segments', self.segmentId, 'points'], (points) => points.insert(self.index, point)), id);
  }

  return state.deleteIn(['segments', id, 'points', action.index]);
}
    
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
      return points.insert(action.index, fromJS(point));
    });
}

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

const splitSegment = (state, action) => {
    const id = action.segmentId;
    const segment = state.get('segments').get(id);
    let _points = segment.get('points');
    const newSegment = _points.slice(action.index, _points.count());

    
    state = state.updateIn(['segments', id, 'points'], (points) => {
      return points.slice(0, action.index + 1);
    })
    
    state = updateSegment(state, id);

    const segData = createSegmentObj(segment.get('trackId'), newSegment.toJS(), [], [], state.get('segments').count());
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
      return toggleSegmentProp(state, id, 'splitting');
    }
}

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
        const lastSeg = createSegmentObj(trackId, otherSegmentPoints.toJS(), [], [], state.get('segments').count(), details.segment);
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
        const lastSeg = createSegmentObj(trackId, otherSegmentPoints.toJS(), [], [], state.get('segments').count(), details.segment);
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

  state = toggleSegmentProp(state, action.segmentId, 'joining');
  state = segments(state, removeSegmentAction(details.segment));

  return updateSegment(state, action.segmentId);
}

const updateTimeFilterSegment = (state, action) => {
  return state.updateIn(['segments', action.segmentId, 'timeFilter'], (f) => {
    return f.set(0, action.lower).set(1, action.upper);
  });
}

const toggleTimeFilter = (state, action) => {
  return state.updateIn(['segments', action.segmentId, 'showTimeFilter'], (f) => {
    return !f;
  });
}

const defaultPropSet = ['editing', 'splitting', 'joining', 'pointDetails', 'showTimeFilter'];

// sets prop as true and false to others, in order to indicate the active feature
const toggleSegmentProp = (state, id, prop, propSet = defaultPropSet) => {
  const data = state.get('segments').get(id);

  propSet.forEach((p) => {
    state = state.setIn(['segments', id, p], (p === prop ? !data.get(p) : false))
  });

  return state;
}    

const toggleSegmentVisibility = (state, action) => {
    const id = action.segmentId;
    state = toggleSegmentProp(state, id, 'display');
    return state.setIn(['segments', id, 'display'], !state.get('segments').get(id).get('display'));
}

const toggleSegmentEditing = (state, action) => {
  const id = action.segmentId;

  if (state.get('segments').get(id).get('editing')) {
    state = updateSegment(state, id);
    state = state.setIn(['segments', id, 'selectedPoints'], new List());
  }

  return toggleSegmentProp(state, id, 'editing');
}

const toggleSegmentSplitting = (state, action) => {
  const id = action.segmentId;

  return toggleSegmentProp(state, id, 'splitting');
}

const toggleSegmentPointDetails = (state, action) => {
  const id = action.segmentId;

  return toggleSegmentProp(state, id, 'pointDetails');
}

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

const updateLocationName = (state, action) => {
  const { segmentId, start, name } = action;
  const locationIndex = start ? 0 : 1;
  return state.setIn(['segments', segmentId, 'locations', locationIndex, 'label'], name);
}

const updateTransportationMode = (state, action) => {
  const { segmentId, name, index } = action;
  return state.updateIn(['segments', segmentId, 'transportationModes', index], (tmode) => {
    if (tmode) {
      return tmode.set('label', name);
    } else {
      return tmode;
    }
  });
}

const updateTransportationTime = (state, action) => {
  const { segmentId, time, start, tmodeIndex } = action;
  return state.updateIn(['segments', segmentId, 'transportationModes', tmodeIndex], (tmode) => {
    const seg = state.get('segments').get(segmentId);
    const hours = parseInt(time.substr(0, 2), 10);
    const mins = parseInt(time.substr(2), 10);

    const t = moment(segmentStartTime(seg).clone().hours(hours).minutes(mins)).valueOf();
    const timeIndex = seg.get('points').findIndex((point) => point.get('time').valueOf() >= t);

    if (timeIndex > -1) {
      if (start) {
        if (segmentStartTime(seg).format('HHmm') === time) {
          return tmode;
        } else {
          return tmode.set('from', timeIndex);
        }
      } else {
        if (egmentEndTime(seg).format('HHmm') === time) {
          return tmode;
        } else {
          return tmode.set('to', timeIndex);
        }
      }
    } else {
      console.error(new Error('Invalid time for segment'));
      return tmode;
    }
  });
}

const selectPointInMap = (state, action) => {
  const { onClick, segmentId, highlightedPoint } = action;
  return state.setIn(['segments', segmentId, 'pointAction'], Map({ highlightedPoint, onClick }));
}

const deselectPointInMap = (state, action) => {
  const { segmentId } = action;
  return state.setIn(['segments', segmentId, 'pointAction'], null);
}

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

const updatePoint = (state, action) => {
  const { segmentId, index, lat, lon, time } = action;
  return state.updateIn(['segments', segmentId, 'points', index], (point) => {
    return point
      .set('lat', lat)
      .set('lon', lon)
      .set('time', time)
  });
}

const addNewSegment = (state, action) => {
  const { trackId, point } = action;
  const seg = createSegmentObj(trackId, [point]);
  return state
    .setIn(['segments', seg.get('id')], seg)
    .updateIn(['tracks', trackId, 'segments'], (segs) => segs.add(seg.get('id')));
}

const setTransportationModes = (state, action) => {
  const { modes } = action;

  let touched = Set([]);
  modes.map((mode) => {
    const { label } = mode;
    const { segmentId } = mode.from;

    const to = segmentId === mode.to.segmentId ? mode.to.index : -1;
    const from = mode.from.index;

    state = state.updateIn(['segments', segmentId, 'transportationModes'], (transp) => {
      if (!touched.has(segmentId)) {
        transp = transp.clear();
        touched = touched.add(segmentId);
      }

      return transp.push(Map({ from, to, label }));
    });
  });

  return state;
}

const ACTION_REACTION = {
    'segment/toggle_visibility': toggleSegmentVisibility,
    'segment/toggle_edit': toggleSegmentEditing,
    'segment/toggle_split': toggleSegmentSplitting,
    'segment/toggle_join': toggleSegmentJoining,
    'segment/toggle_point_details': toggleSegmentPointDetails,
    'segment/toggle_time_filter': toggleTimeFilter,
 
    'segment/change_point': changeSegmentPoint,
    'segment/remove_point': removeSegmentPoint,
    'segment/add_point': addSegmentPoint,
 
    'segment/extend': extendSegment,
    'segment/remove': removeSegment,
    'segment/split': splitSegment,
    'segment/join': joinSegment,
    'segment/add_possibilities': addPossibilities,
    'segment/time_filter': updateTimeFilterSegment,

    'segment/update_location_name': updateLocationName,
    'segment/set_transportation_modes': setTransportationModes,
    'segment/update_transportation_mode': updateTransportationMode,
    'segment/update_transportation_time': updateTransportationTime,
    'segment/select_point_in_map': selectPointInMap,
    'segment/deselect_point_in_map': deselectPointInMap,
    'segment/select_point': selectPoint,
    'segment/deselect_point': deselectPoint,

    'segment/straight_selected': straightSelected,
    'segment/update_point': updatePoint,
    'segment/new': addNewSegment
}

const segments = (state = [], action) => {
    if (ACTION_REACTION[action.type]) {
      return ACTION_REACTION[action.type](state, action);
    } else {
      return state;
    }
  }

export default segments;