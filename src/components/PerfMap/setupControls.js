import React from 'react';
import { Control } from 'leaflet';
import ControlButton from './ControlButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import SettingsIcon from '@mui/icons-material/Settings';

export default (map, actions) => {
  new Control.Zoom({
    position: 'topright'
  }).addTo(map);

  const btns = new ControlButton([
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
  ])

  btns.addTo(map);

  if (actions.canUndo === false) {
    btns.setEnabled(0, false);
  }
  if (actions.canRedo === false) {
    btns.setEnabled(1, false);
  }

  map.buttons = btns;
  
  new ControlButton({
    button: (<MyLocationIcon style={{ font: 'normal normal normal 14px/1', fontSize: 'inherit', color: 'black' }} className='clickable' />),
    title: 'Position on your location',
    onClick: () => map.locate({setView: true})
  }).addTo(map);

  new ControlButton({
    button: (<SettingsIcon style={{ font: 'normal normal normal 14px/1', fontSize: 'inherit', color: 'black' }} className='clickable' />),
    title: 'Configurations',
    onClick: actions.config
  }).addTo(map);
}
