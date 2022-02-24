import React from 'react';
import { Polyline, FeatureGroup } from 'leaflet';
import { createPointsFeatureGroup, renderToDiv, createPointIcon, createMarker } from './utils';
import SegmentToolbox from '../../containers/TrackList/SegmentToolbox';

import store from '../../store';
import { Provider } from 'react-redux';

import StopIcon from '@mui/icons-material/Stop';
import PlayIcon from '@mui/icons-material/PlayArrow';

import buildTransportationModeRepresentation from './buildTransportationModeRepresentation';
import { renderToString } from 'react-dom/server';

export default (id, points, color, display, filter, segment, dispatch, previousPoints, currentSegment) => {
  const tfLower = (filter.get(0) || points.get(0).get('time')).valueOf();
  const tfUpper = (filter.get(-1) || points.get(-1).get('time')).valueOf();
  const timeFilter = (point) => {
    const t = point.get('time');
    return tfLower <= t && t <= tfUpper;
  }
  const pts = points.filter(timeFilter).map((point) => ({lat: point.get('lat'), lon: point.get('lon')})).toJS();

  const pline = new Polyline(pts, {
    color,
    weight: 8,
    opacity: display ? 1 : 0
  }).on('click', (e) => {
    const popup = renderToDiv(
      <Provider store={store}>
        <SegmentToolbox segment={segment} dispatch={dispatch} isPopup={true}/>
      </Provider>
    )
    e.target.bindPopup(popup, { autoPan: false }).openPopup()
  });

  const pointsEventMap = {};
  const pointsLayer = createPointsFeatureGroup(pts, color, pointsEventMap);
  
  const specialMarkers = {
    start: createMarker(pts[0], createPointIcon(color, renderToString(<PlayIcon className='center' sx={{ fontSize: 16 }}/>))),
    end: createMarker(pts[pts.length - 1], createPointIcon(color, renderToString(<StopIcon className='center' sx={{ fontSize: 16 }}/>)))
  }
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
