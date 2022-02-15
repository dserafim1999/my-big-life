import React from 'react';
import { Control } from 'leaflet';
import ControlButton from './ControlButton';
import MyLocationIcon from '@mui/icons-material/MyLocation';

export default (map, actions) => {
  new Control.Zoom({
    position: 'topright'
  }).addTo(map);
  
  new ControlButton({
    button: (<MyLocationIcon style={{ font: 'normal normal normal 14px/1', fontSize: 'inherit', color: 'black' }} className='clickable' />),
    title: 'Position on your location',
    onClick: () => map.locate({setView: true})
  }).addTo(map);
}
