import React from 'react';
import { LayerGroup, Polyline, Circle, Popup } from 'react-leaflet';

const buildPopup = (lat, lon, time, distance, velocity, n) => {
  return (
    <Popup>
      <div>
        <div>#{n}</div>
        <div>Lat: <b>{lat}</b> Lon: <b>{lon}</b></div>
        <div>Time: <b>{time.toString()}</b></div>
        <div><b>{(distance * 1000).toFixed(3)}</b>m at <b>{velocity.toFixed(3)}</b>km/h</div>
      </div>
    </Popup>
  )
}

let _id = 0;
const PointPolyline = (props) => {
  const { popupInfo, radius, positions, map, onPointClick, showEnd, showStart } = props;
  let clickHandler = onPointClick || function () {};
  let points;

  if (!popupInfo) {
    points = positions.map((point, i) => {
      return (
        <Circle color={"#ffffff"} center={point} radius={radius || 2} key={_id++} eventHandlers={{ click: (e) => { clickHandler(point, i, e)} }} />
      );
    })
  } else {
    points = popupInfo.map((point, i) => {
      return (
        <Circle center={{lat: point.lat, lon: point.lon}} radius={radius || 2} key={_id++} eventHandlers={{ click: (e) => { clickHandler(point, i, e)} }} >
          { buildPopup(point.lat, point.lon, point.time, point.distance, point.velocity, i) }
        </Circle>
      );
    })
  }

  if (showStart || showEnd) {
    let pts = [];
    if (showStart) {
      let p = (
        <Circle center={positions[0]} radius={radius || 2} key={_id++} eventHandlers={{ click: (e) => { showStart(e)} }} />
      );
      pts.push(p);
    }
    if (showEnd) {
      let p = (
        <Circle center={positions[positions.length - 1]} radius={radius || 2} key={_id++} eventHandlers={{ click: (e) => { showEnd(e)} }} />
      );
      pts.push(p);
    }
    points = pts;
  }

  return (
    <LayerGroup map={map} >
      { points }
    </LayerGroup>
  );
}

export default PointPolyline;