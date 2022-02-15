import {
  createSegmentObj,
  calculateMetrics
} from './utils';
import { removeSegment as removeSegmentAction } from "../actions/segments";
import { fromJS } from 'immutable';

const updateSegment = (state, id) => {
  // TODO update bounds
    return state.updateIn(['segments', id], (segment) => {
      const pts = segment.get('points');
      const metrics = calculateMetrics(pts.toJS());

      return segment
        .set('start', pts.get(0).get('time'))
        .set('end', pts.get(-1).get('time'))
        .set('metrics', fromJS(metrics));
    });
}

const changeSegmentPoint = (state, action) => {
  const id = action.segmentId;

  state = state.setIn(['segments', id, 'points', action.index, 'lat'], action.lat);
  state = state.setIn(['segments', id, 'points', action.index, 'lon'], action.lon);
  // TODO updateBounds
  
  return state;
}

const removeSegmentPoint = (state, action) => {
  const id = action.segmentId;

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

    let point = {
      lat: action.lat,
      lon: action.lon,
      time: extrapolateTime(state.get('segments').get(id).get('points'), action.index)
    }
 
    return state.updateIn(['segments', id, 'points'], (points) => {
      if (action.index === 0) {
        return points.unshift(point);
      } else {
        return points.push(pointExtend);
      }
    });
}

const addSegmentPoint = (state, action) => {
    const id = action.segmentId;

    // when adding a point between two other points the time is interpolated is the difference between the two points halved.
    const extrapolateTime = (points, n) => {
        let prev = points.get(n - 1).get('time');
        let next = points.get(n + 1).get('time');
        let diff = next.diff(prev) / 2;
        return prev.clone().add(diff);
    }

    let point = {
        lat: action.lat,
        lon: action.lon,
        time: extrapolateTime(state.get('segments').get(id).get('points'), action.index)
  }

  return state.updateIn(['segments', id, 'points'], (points) => {
    return points.insert(action.index, fromJS(point));
  });
}

const removeSegment = (state, action) => {
    // TOFIX needs update to remove from map
    const id = action.segmentId;
    const trackId = state.get('segments').get(id).get('trackId');
    state = state.deleteIn(['segments', action.segmentId]);
    if (state.get('tracks').get(trackId).get('segments').count() === 1) {
      state = state.deleteIn(['tracks', trackId]);
    } else {
      state = state.updateIn(['tracks', trackId, 'segments'], (segments) => {
        return segments.delete(segments.indexOf(id))
      });
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

    const segData = createSegmentObj(segment.get('trackId'), newSegment.toJS(), state.get('segments').count());
    state = state.setIn(['segments', segData.id], fromJS(segData));

    state = state.updateIn(['tracks', segment.get('trackId'), 'segments'], (segments) => {
      return segments.push(segData.id);
    });

    return toggleSegmentProp(state, id, 'splitting');
}

const joinSegment = (state, action) => {
  const { details } = action;
  const toRemove = state.get('segments').get(details.segment);

  state = state.updateIn(['segments', action.segmentId, 'points'], (points) => {
    //TODO rename destiny
    if (details.destiny !== 'START') {
      toRemove.get('points').forEach((p) => {
        points = points.push(p)
      });
    } else {
      toRemove.get('points').reverse().forEach((p) => {
        points = points.unshift(p)
      });
    }
    return points;
  });

  state = toggleSegmentProp(state, action.segmentId, 'joining');
  return segments(state, removeSegmentAction(toRemove.get('id')));
}

const updateTimeFilterSegment = (state, action) => {
  return state.updateIn(['segments', action.segmentId, 'timeFilter'], (f) => {
    return f.set(0, action.lower).set(1, action.upper);
  })
}

const toggleTimeFilter = (state, action) => {
  return state.updateIn(['segments', action.segmentId, 'showTimeFilter'], (f) => {
    return !f;
  })
}

const defaultPropSet = ['editing', 'splitting', 'joining', 'pointDetails'];

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

const toggleSegmentJoining = (state, action) => {
  const id = action.segmentId;
  const segment = state.get('segments').get(id);
  const trackId = segment.get('trackId');
  const track = state.get('tracks').get(trackId);

  if (track.get('segments').count() > 1) {
    let possibilities = [];
    let candidates = track.get('segments').toJS();
    candidates.splice(candidates.indexOf(id), 1);

    let sStart = segment.get('start');
    let sEnd = segment.get('end');

    let closerToStart, closerToEnd;
    let t_closerToStart = Infinity;
    let t_closerToEnd = Infinity;

    candidates.forEach((c, i) => {
      const _c = state.get('segments').get(c);
      const start = _c.get('start');
      const end = _c.get('end');

      let startDiff = start.diff(sEnd);
      let endDiff = end.diff(sStart);

      if (startDiff >= 0 && startDiff < t_closerToStart) {
        t_closerToStart = startDiff;
        closerToStart = _c.get('id');
      } else if (endDiff <= 0 && endDiff < t_closerToEnd) {
        t_closerToEnd = endDiff;
        closerToEnd = _c.get('id');
      }
    })

    if (closerToStart !== undefined) {
      possibilities.push({
        segment: closerToStart,
        destiny: 'END',
        show: 'END'
      });
    }
    if (closerToEnd !== undefined) {
      possibilities.push({
        segment: closerToEnd,
        destiny: 'START',
        show: 'START'
      });
    }

    state = state.setIn(['segments', id, 'joinPossible'], possibilities);
    
    return toggleSegmentProp(state, action.segmentId, 'joining');
  } else {
    alert('Can\'t join with any segment of the same track');
  }

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
    'segment/time_filter': updateTimeFilterSegment,
}

const segments = (state = [], action) => {
    if (ACTION_REACTION[action.type]) {
      return ACTION_REACTION[action.type](state, action);
    } else {
      return state;
    }
  }

export default segments;