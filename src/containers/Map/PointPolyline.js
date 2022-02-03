import React from 'react';
import { LayerGroup, Polyline, Circle } from 'react-leaflet';

let _id = 0;
const PointPolyline = (props) => {
  const { radius, positions, map, onPointClick } = props;
  let clickHandler = onPointClick || function () {};

  const points = positions.map((point, i) => {
    return (
      <Circle color={"#ffffff"} center={point} radius={radius || 2} key={_id++} eventHandlers={{ click: (e) => { clickHandler(point, i, e)} }} />
    );
  })

  return (
    <LayerGroup map={map} >
      <Polyline {...props} />
      { points }
    </LayerGroup>
  );
}

export default PointPolyline;