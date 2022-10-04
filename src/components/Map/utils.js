import React from 'react';
import { render } from 'react-dom';
import { DivIcon, Marker, FeatureGroup } from 'leaflet';
import { renderToString } from 'react-dom/server';

import LocationIcon from '@mui/icons-material/LocationOn';

export const renderToDiv = (component) => {
  const div = document.createElement('div');
  render(component, div);
  return div;
}

export const createPointIcon = (color, inside, moreClass = '', iconAnchor = [12, 12]) =>
  new DivIcon({
    className: 'editable-point' + (color ? ' border-color-' + color.substr(1) : '') + ' ' + moreClass,
    html: inside || '',
    iconAnchor
  });

export const createLocationIcon = (color, inside, moreClass = '', iconAnchor = [9, 9]) =>
  new DivIcon({
    className: 'location-point',
    html: inside || '',
    iconAnchor
  });

export const setupMarker = (marker, index, previous, next, type = 'NORMAL') => {
  marker.index = index;
  marker.previous = previous;
  marker.next = next;
  marker.type = type;

  return marker;
}

export const createMarker = (point, icon, draggable = false) => 
  new Marker(point, { icon, draggable });

export const createLocationMarker = (point, color) => {
  const locationStyle = {
    color: color
  };
  const marker = createMarker(point, createLocationIcon(color, 
    renderToString(
      <LocationIcon className='center' style={locationStyle} sx={{ fontSize: 16 }}/>
    )));
  marker.bindTooltip(point.label, {direction: 'top'});

  return marker;
}

export const createPointsFeatureGroup = (pts, color, pointsEventMap = {}) => {
  const icon = createPointIcon(color);
  const cpts = pts.map((point, i) => {
    return setupMarker(createMarker(point, icon), i, i - 1, i + 1);
  })
  const pointsLayer = new FeatureGroup(cpts);

  return pointsLayer;
}
