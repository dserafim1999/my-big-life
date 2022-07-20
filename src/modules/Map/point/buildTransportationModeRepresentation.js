import React from 'react'
import { FeatureGroup } from 'leaflet'
import { renderToString } from 'react-dom/server'

import StopIcon from '@mui/icons-material/Stop';
import WalkIcon from '@mui/icons-material/DirectionsWalk';
import CarIcon from '@mui/icons-material/DirectionsCar';
import TrainIcon from '@mui/icons-material/DirectionsRailway';
import PlaneIcon from '@mui/icons-material/Flight';
import BoatIcon from '@mui/icons-material/DirectionsBoat';
import QuestionIcon from '@mui/icons-material/QuestionMark';
import { createPointIcon, createMarker } from '../utils';

const LABEL_TO_ICON = {
  'stop': (color) => createPointIcon(color, renderToString(<StopIcon className='center' sx={{ fontSize: 16 }}/>)),
  'foot': (color) => createPointIcon(color, renderToString(<WalkIcon className='center' sx={{ fontSize: 16 }}/>)),
  'vehicle': (color) => createPointIcon(color, renderToString(<CarIcon className='center' sx={{ fontSize: 16 }}/>)),
  'airplane': (color) => createPointIcon(color, renderToString(<PlaneIcon className='center' sx={{ fontSize: 16 }}/>)),
  'train': (color) => createPointIcon(color, renderToString(<TrainIcon className='center' sx={{ fontSize: 16 }}/>)),
  'boat': (color) => createPointIcon(color, renderToString(<BoatIcon className='center' sx={{ fontSize: 16 }}/>)),
  '?': (color) => createPointIcon(color, renderToString(<QuestionIcon className='center' sx={{ fontSize: 16 }}/>))
}

const angleBetween = (a, b) => {
  return Math.tanh((a.lat - b.lat) / (a.lon - b.lon)) * -1;
}

const buildVerticalMarker = (color, start, next, previous, label) => {
  let angle = 0;
  if (next) {
    angle = angleBetween(start, next);
  } else if (previous) {
    angle = angleBetween(previous, start);
  }

  const iconCreator = LABEL_TO_ICON[label] || LABEL_TO_ICON['?'];

  return createMarker(start, iconCreator(color))
}

export default (lseg, segment) => {
  const transModes = segment.get('transportationModes');
  const color = segment.get('color');
  let tModes = [];
  let lastTo;
  const pts = segment.get('points').toJS();

  if (transModes && transModes.count() > 0) {
    // debugger
    tModes = transModes.map((mode) => {
      console.log(mode);
      const from = mode.get('from');
      const to = mode.get('to');
      const label = mode.get('label').toLocaleLowerCase();
  
      lastTo = to - 1;
      return buildVerticalMarker(color, pts[from], pts[from + 1], pts[from - 1], label);
    }).toJS();

    console.log(pts)
    console.log(lastTo)

    tModes.push(buildVerticalMarker(color, pts[lastTo], null, pts[lastTo - 1]));
  }

  return new FeatureGroup(tModes);
}