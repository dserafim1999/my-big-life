import { DivIcon, Polyline, FeatureGroup } from 'leaflet';
import { createMarker, setupMarker } from '../utils';

import editPointProperties from './editPointProperties';

const newPointIcon = new DivIcon({
  className: 'editable-point new-editable-point',
  html: '<div class="center">+</div>',
  iconAnchor: [12, 12]
});

const tearDownMarker = (marker) => {
  marker.off();
  if (marker.dragging) {
    try {
      marker.dragging.disable();
    } catch (e) {
      // debugger
    }
  }
  marker.options.draggable = false;
}

const interpolatePoint = (first, second) => {
  const firstLat = first.get('lat');
  const secondLat = second.get('lat');
  const firstLon = first.get('lon');
  const secondLon = second.get('lon');
  return [firstLat - (secondLat - firstLat), firstLon - (secondLon - firstLon)];
}

const interpolatePointLeaflet = (first, second) => {
  return [first.lat - (second.lat - first.lat), first.lng - (second.lng - first.lng)];
}

const pointInBetween = (prev, after) => {
  const latDiff = after.get('lat') - prev.get('lat');
  const lonDiff = after.get('lon') - prev.get('lon');

  return [prev.get('lat') + latDiff / 2, prev.get('lon') + lonDiff / 2];
}

const pointInBetweenLeaflet = (prev, after) => {
  const latDiff = after.lat - prev.lat;
  const lonDiff = after.lng - prev.lng;

  return [prev.lat + latDiff / 2, prev.lng + lonDiff / 2];
}

/**
 * Updates the polyline and new point markers after a
 *   point has been moved. Point markers are updated
 *   by the user, when dragging
 */
const updateMove = (lseg, index, lat, lng, target, glayers) => {
  // update polyline
  const platlangs = lseg.polyline.getLatLngs();
  const ppoint = platlangs[index];
  ppoint.lat = lat;
  ppoint.lng = lng;
  lseg.polyline.setLatLngs(platlangs);

  // new point marker
  const { previous, next } = target;
  if (index === 0) {
    // Updating first point
    const point = pointInBetweenLeaflet(platlangs[1], ppoint);
    glayers[0].setLatLng(point);
    lseg.specialMarkers.start.setLatLng(ppoint);

    const epoint = interpolatePointLeaflet(ppoint, platlangs[1]);
    const ti = glayers[glayers.length - 2].getLayers();
    ti[0].setLatLng(epoint);
    ti[1].setLatLngs([ppoint, epoint]);
  } else if ((index + 1) === platlangs.length) {
    // Updating last point
    const point = pointInBetweenLeaflet(ppoint, platlangs[previous]);
    glayers[previous].setLatLng(point);
    lseg.specialMarkers.end.setLatLng(ppoint);

    const epoint = interpolatePointLeaflet(ppoint, platlangs[previous]);
    const ti = glayers[glayers.length - 1].getLayers();
    ti[0].setLatLng(epoint);
    ti[1].setLatLngs([epoint, ppoint]);
  } else {
    glayers[previous].setLatLng(pointInBetweenLeaflet(platlangs[previous], ppoint));
    glayers[index].setLatLng(pointInBetweenLeaflet(ppoint, platlangs[next]));
  }
}

const setupExistingMarker = (marker, i, editModeHandler, removePoint, visualHelper, editPP) => {
  if(!marker) return;

  marker.options.draggable = true;
  marker.on('click', editPP);
  marker.on('dragend', editModeHandler);
  marker.on('contextmenu', removePoint);
  marker.on('drag dragstart dragend', visualHelper);
  
  return marker;
}

export default (lseg, current, previous, actions, dispatch) => {
  const id = current.get('id');
  const color = current.get('color');
  const points = current.get('points');

  let group;
  let overlay = [];

  lseg.layergroup.removeLayer(lseg.specialMarkers.start);
  lseg.layergroup.removeLayer(lseg.specialMarkers.end);

  const removePoint = (e) => {
    const {lat, lng} = e.target.getLatLng();
    actions.onRemove(id, e.target.index, lat, lng);
    lseg.details.removeLayer(group);
  }

  const editModeHandler = (e) => {
    const { target } = e;
    const { type, index } = target;
    const {lat, lng} = target.getLatLng();

    if (type === 'NEW') {
      actions.onAdd(id, index, lat, lng);
      lseg.details.removeLayer(group);
    } else if (type === 'NORMAL') {
      lseg.updated = true;
      actions.onMove(id, index, lat, lng);
      updateMove(lseg, index, lat, lng, target, overlay);
    } else if (type === 'EXTEND') {
      actions.onExtend(id, index, lat, lng);
      lseg.details.removeLayer(group);
    }
  }

  let helperLine;
  
  const visualHelper = (e) => {
    const { previous, next } = e.target;
    const points = lseg.points.getLayers();

    const latlngs = [
      points[previous] ? points[previous].getLatLng() : null,
      e.target.getLatLng(),
      points[next] ? points[next].getLatLng() : null
    ];

    if (e.target.helperLine) {
      if (e.type === 'drag') {
        e.target.helperLine.setLatLngs(latlngs.filter((x) => x));
      }
    } else {
      if (e.type === 'dragstart') {
        helperLine = new Polyline(latlngs.filter((x) => x), { color, opacity: 0.8 });
        helperLine.addTo(group);
      } else if (e.type === 'drag' && helperLine) {
        helperLine.setLatLngs(latlngs.filter((x) => x));
      } else if (e.type === 'dragend' && helperLine) {
        group.removeLayer(helperLine);
        helperLine = undefined;
      }
    }
  }

  const setupNewMarker = (point, i) => {
    return setupMarker(createMarker(point, newPointIcon, true), i, i - 1, i, 'NEW')
    .on('dragend click', editModeHandler)
    .on('drag dragstart dragend', visualHelper);
  }

  let prevPoint;

  const markers = lseg.points.getLayers();
  const editPP = editPointProperties(lseg, current, dispatch);

  points.forEach((point, i) => {
    if (prevPoint) {
      overlay.push(setupNewMarker(pointInBetween(prevPoint, point), i));
    }
    setupExistingMarker(markers[i], i, editModeHandler, removePoint, visualHelper, editPP);
    prevPoint = point;
  })

  const guideOptions = {
    color,
    dashArray: '5, 5'
  };
  
  const newAndGuide = (point, guideEnd, a, b, c) => {
    const marker = setupMarker(createMarker(point, newPointIcon, true), a, b, c, 'EXTEND')
    .on('dragend click', editModeHandler)
    .on('drag dragstart dragend', visualHelper);

    const guide = new Polyline([ point, guideEnd ], guideOptions);
    marker.helperLine = guide;
    return new FeatureGroup([marker, guide]);
  }

  // extend polyline
  if (points.count() === 1) {
    const start = points.get(0);
    const aPoint = start.set('lat', start.get('lat') + 0.0001);
    const bPoint = start.set('lat', start.get('lat') - 0.0001);
    const startInterpolated = interpolatePoint(start, aPoint);
    const startGuide = newAndGuide(startInterpolated, markers[0].getLatLng(), 1, -1, 0);
    overlay.push(startGuide);

    const endInterpolated = interpolatePoint(points.get(-1), bPoint);
    const endGuide = newAndGuide(endInterpolated, markers[0].getLatLng(), 1, -1, 0);
    overlay.push(endGuide);
  } else {
    const startInterpolated = interpolatePoint(points.get(0), points.get(1));
    const startGuide = newAndGuide(startInterpolated, markers[0].getLatLng(), 0, -1, 0);
    overlay.push(startGuide);
    
    const endInterpolated = interpolatePoint(points.get(-1), points.get(-2));
    const endGuide = newAndGuide(endInterpolated, markers[markers.length - 1].getLatLng(), points.count(), points.count() - 1, points.count() - 1);
    overlay.push(endGuide);
  }

  group = new FeatureGroup(overlay);
  group.addTo(lseg.details);
  lseg.points.addTo(lseg.details);
  markers.forEach((m) => !m.dragging || m.dragging.enable());

  lseg.tearDown = (current, previous) => {
    if (!current.get('editing') || (current.get('editing') && current.get('points') !== previous.get('points'))) {
      lseg.details.removeLayer(lseg.points);
      lseg.details.removeLayer(group);
      lseg.points.getLayers().forEach((m) => tearDownMarker(m));

      lseg.specialMarkers.start.addTo(lseg.layergroup);
      lseg.specialMarkers.end.addTo(lseg.layergroup);

      lseg.tearDown = null;
    } else if (current.get('selectedPoints') !== previous.get('selectedPoints')) {
      const lpoints = lseg.points.getLayers();

      let psp = previous.get('selectedPoints');
      if (psp) {
        psp = psp.sort();
        const psp_start = psp.get(0);
        const psp_end = psp.get(-1);
        for (let i = psp_start; i <= psp_end; i++) {
          lpoints[i]._icon.className = lpoints[i]._icon.className.split(' ').filter((x) => x !== 'selected-point').join(' ');
        }
      }

      let csp = current.get('selectedPoints');
      if (csp) {
        csp = csp.sort();
        const csp_start = csp.get(0);
        const csp_end = csp.get(-1);
        for (let i = csp_start; i <= csp_end; i++) {
          lpoints[i]._icon.className = lpoints[i]._icon.className + ' selected-point';
        }
      }
    }
  }
}
