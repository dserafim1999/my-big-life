import React from 'react';
import { Control } from 'leaflet';
import ControlButton from './ControlButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';

export default (map, actions) => {
  new Control.Zoom({
    position: 'topright'
  }).addTo(map);

  new ControlButton([
    {
      button: (<UndoIcon style={{ font: 'normal normal normal 14px/1', fontSize: 'inherit' }} className='clickable' />),
      title: 'Undo',
      onClick: actions.undo
    },
    {
      button: (<RedoIcon style={{ font: 'normal normal normal 14px/1', fontSize: 'inherit' }} className='clickable' />),
      title: 'Redo',
      onClick: actions.redo
    }
  ]).addTo(map)
  
  new ControlButton({
    button: (<MyLocationIcon style={{ font: 'normal normal normal 14px/1', fontSize: 'inherit', color: 'black' }} className='clickable' />),
    title: 'Position on your location',
    onClick: () => map.locate({setView: true})
  }).addTo(map);
}
