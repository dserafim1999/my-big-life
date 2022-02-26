import moment from 'moment';
import { generateTrackId, generateSegmentId } from '../reducers/idState';
import colors from '../reducers/colors';
import haversine from '../haversine';
import { Map,Record, List, Set, fromJS } from 'immutable';
import { min, max } from '../utils';

export class BoundsRecord extends Record({
  minLat: Infinity,
  minLon: Infinity,
  maxLat: -Infinity,
  maxLon: -Infinity
}) {
  update (point) {
    return this
      .set('minLat', min(this.minLat, point.get('lat')))
      .set('minLon', min(this.minLon, point.get('lon')))
      .set('maxLat', max(this.maxLat, point.get('lat')))
      .set('maxLon', max(this.maxLon, point.get('lon')));
  }
  updateWithBounds (bounds) {
    return this
      .set('minLat', min(this.minLat, bounds.get('minLat')))
      .set('minLon', min(this.minLon, bounds.get('minLon')))
      .set('maxLat', max(this.maxLat, bounds.get('maxLat')))
      .set('maxLon', max(this.maxLon, bounds.get('maxLon')));
  }

}

export const computeBounds = (points) => {
  return points.reduce((bounds, point) => bounds.update(point), new BoundsRecord());
}

export const getSegmentById = (id, state) =>
  state.map((track) =>
    track.segments.find((x) => x.id === id)
  ).find((x) => !!x);

export const getTrackBySegmentId = (id, state) =>
  state.map((track) =>
    track.segments.find((s) => s.id === id) ? track : null
  ).find((x) => !!x);

const POINT_DEFAULTS = {
  lat: 0,
  lon: 0,
  time: null
}

class PointRecord extends Record(POINT_DEFAULTS) {
  distance (point, unit = 'km') {
    return haversine(
      point.get('lat'),
      point.get('lon'),
      this.get('lat'),
      this.get('lon'),
      { unit }
    );
  }

  dt (prev) {
    if (prev.get('time') && this.get('time')) {
      return this.get('time').diff(prev.get('time'));
    } else {
      return 0;
    }
  }
}

const ModeRecord = Record({
  point: false,
  split: false,
  join: false,
  details: false,
  filter: false,
  timeFilterStart: null,
  timeFilterEnd: null
});

const MetricsRecord = Record({
  distance: 0,
  averageVelocity: 0
});

const SEGMENT_DEFAULT_PROPS = {
  id: undefined,
  name: '',
  trackId: undefined,
  points: new List(),
  bounds: new BoundsRecord(),
  display: true,
  color: 'black',
  // editing: new ModeRecord({}),
  metrics: new MetricsRecord({}),

  pointDetails: false,
  splitting: false,
  joining: false,
  editing: false,
  selectedPoints: new List(),
  joinPossible: new List(),
  showTimeFilter: false,
  timeFilter: new List([]),

  location: new List([]),
  transportationModes: new List([])

}

const computeMetrics = (points) => {
  const convert = 1 / 3600000;
  let accVelocity = 0;
  let distance = 0;
  points.forEach((point, i) => {
    if (i === 0) {
      return;
    }

    const prev = points.get(i - 1);
    const dx = prev.distance(point);
    const timeDiff = point.dt(prev) * convert;
    const velocity = timeDiff === 0 ? 0 : dx / timeDiff;
    distance += dx;
    accVelocity += velocity;
  });

  return MetricsRecord({
    distance,
    averageVelocity: accVelocity / points.count()
  });
}

export const pointsToRecord = (points) => {
  return new List(points.map((point) => {
    point.time = point.time ? moment(point.time) : null;
    return new PointRecord(point);
  }));
}

export class SegmentRecord extends Record(SEGMENT_DEFAULT_PROPS) {
  constructor (defaultValues) {
    defaultValues.bounds = defaultValues.bounds || computeBounds(defaultValues.points);
    defaultValues.metrics = defaultValues.metrics || computeMetrics(defaultValues.points);
    super(defaultValues, 'Segment');
  }
  getStartTime () {
    return this.points.get(0).get('time');
  }
  getEndTime () {
    return this.points.get(-1).get('time');
  }
  pointCount() {
    return this.points.count();
  }
}

export const createSegmentObj = (trackId, points, location, transModes, nSegs, customId) => {
  let sId = customId === undefined ? generateSegmentId() : customId;
  return new SegmentRecord({
    trackId,
    id: sId,
    color: colors(customId === undefined ? max(nSegs, sId) : customId),
    points: pointsToRecord(points),
    location: fromJS(location),
    transportationModes: fromJS(transModes)
  });
}

export class TrackRecord extends Record({
  id: -1,
  name: '',
  renaming: false,
  segments: List([])
}) {
  constructor (defaultValues) {
    defaultValues.id = defaultValues.id || generateTrackId();
    super(defaultValues, 'Track');
  }
}

export const createTrackObj = (name, segments, locations = [], transModes = [], n = 0) => {
  let track = new TrackRecord({ name });
  let segs = segments.filter((s) => s.length !== 0).map((segment, i) => createSegmentObj(track.id, segment, locations[i], transModes[i], n + i));
  track = track.set('segments', new Set(segs.map((s) => s.get('id'))));

  return {
    track,
    segments: segs
  };
}