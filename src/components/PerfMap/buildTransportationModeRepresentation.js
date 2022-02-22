import React from 'react'
import { FeatureGroup, Marker, DivIcon } from 'leaflet'
import { renderToString } from 'react-dom/server'

import StopIcon from '@mui/icons-material/Stop';
import WalkIcon from '@mui/icons-material/DirectionsWalk';
import CarIcon from '@mui/icons-material/DirectionsCar';

const LABEL_TO_ICON = {
  'Stop': StopIcon,
  'Foot': WalkIcon,
  'Vehicle': CarIcon
}

const angleBetween = (a, b) => {
  return Math.tanh((a.lat - b.lat) / (a.lon - b.lon)) * -1;
}

const buildVerticalMarker = (start, next, previous, label) => {
  let angle = 0;
  if (next) {
    angle = angleBetween(start, next);
  } else if (previous) {
    angle = angleBetween(previous, start);
  }

  const Icon = LABEL_TO_ICON[label];

  const m = (
    <div style={{ transform: 'rotate(' + angle + 'rad)' }}>
      <div style={{ width: '2px', height: '14px', backgroundColor: 'black' }}></div>
      <Icon style={{ position: 'relative', top: '5px', left: '-6px', color: 'black', fontSize: '12px' }}/>
    </div>
  );

  return new Marker(start, { icon: new DivIcon({ className: '', html: renderToString(m) }) });
}

export default (lseg, segment) => {
  const transModes = segment.get('transportationModes');
  let tModes = [];
  let lastTo;
  const pts = segment.get('points').toJS();

  if (transModes && transModes.count() > 0) {
    // debugger
    tModes = transModes.map((mode) => {
      const from = mode.get('from');
      const to = mode.get('to');
      const label = mode.get('label');

      lastTo = to;
      return buildVerticalMarker(pts[from], pts[from + 1], pts[from - 1], label);
    }).toJS();
    tModes.push(buildVerticalMarker(pts[lastTo], null, pts[lastTo - 1]));
  }

  return new FeatureGroup(tModes);
}