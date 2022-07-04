import React from 'react';
import { Polyline, FeatureGroup } from 'leaflet';
import { createPointsFeatureGroup } from './utils';
import { getPolylineStyle, getSpecialMarkers } from './mapConfig'

import buildTransportationModeRepresentation from './buildTransportationModeRepresentation';

export default (id, points, color, display, filter, segment, dispatch, previousPoints, currentSegment) => {
  let pts;

  if (points.get(0).get('time')) {
    const tfLower = (filter.get(0) || points.get(0).get('time')).valueOf();
    const tfUpper = (filter.get(-1) || points.get(-1).get('time')).valueOf();
    const timeFilter = (point) => {
      const t = point.get('time');
      return tfLower <= t && t <= tfUpper;
    }
    pts = points.filter(timeFilter).map((point) => ({lat: point.get('lat'), lon: point.get('lon')})).toJS();
  } else {
    pts = points.map((point) => ({lat: point.get('lat'), lon: point.get('lon')})).toJS();
  }

  const pline = new Polyline(pts, getPolylineStyle(color, display));

  const pointsEventMap = {};
  const pointsLayer = createPointsFeatureGroup(pts, color, pointsEventMap);
  
  const specialMarkers = getSpecialMarkers(pts, color);
  const layergroup = new FeatureGroup([pline, ...Object.keys(specialMarkers).map((k) => specialMarkers[k])]);

  // add segment
  const obj = {
    layergroup,
    specialMarkers,
    polyline: pline,
    points: pointsLayer,
    details: new FeatureGroup(),
    transportation: buildTransportationModeRepresentation(obj, currentSegment)
  };

  return obj;
}
