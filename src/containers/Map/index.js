import React, { useState } from "react";
import { 
    MapContainer,
    TileLayer,
    ZoomControl,
    ScaleControl
} from "react-leaflet";


import {
  hideDetails,
  showDetails,
  updateBounds,
  updateInternalBounds
} from '../../actions/ui';

import Bounds from "./Bounds";
import { connect } from "react-redux";
import MapEvents from "./MapEvents";
import { MAP_STATES } from '../../constants';
import SelectMapSegment from "./SelectMapSegment";


const segmentStateSelector = (segment) => {
    if (segment.get('editing')) {
      return MAP_STATES.EDITING
    } else if (segment.get('splitting')) {
      return MAP_STATES.SPLITING
    } else if (segment.get('joining')) {
      return MAP_STATES.JOINING
    } else if (segment.get('pointDetails')) {
      return MAP_STATES.POINT_DETAILS
    } else {
      return MAP_STATES.NORMAL;
    }
}

const between = (a, b, c) => {
  return a <= b && b <= c;
}

const boundsFilter = (ne, sw) => {
  return (point) => {
  const lat = point.get('lat');
  const lon = point.get('lon');
    return ne.lat >= lat && lat >= sw.lat &&
      ne.lng >= lon && lon >= sw.lng;
  }
}

let Map = ({ bounds, map, segments, details, dispatch}) => {
    let useMaxZoom = false;
    bounds = bounds || [{lat: 67.47492238478702, lng: 225}, {lat: -55.17886766328199, lng: -225}];

    const elms = segments.filter((segment) => segment.get('display')).map((segment) => {
        //const sBounds = segment.get('bounds').toJS();
        const filter = boundsFilter(bounds[0], bounds[1]);

        const inclusive = true;
        const pts = segment.get('points');
        const points = inclusive ? pts.toJS() : pts.filter(filter).toJS();
       
        const state = segmentStateSelector(segment);
        const color = segment.get('color');
        const id = segment.get('id');
        const trackId = segment.get('trackId');
        const joinPossible = segment.get('joinPossible');
        const metrics = segment.get('metrics');
        
        useMaxZoom = state === MAP_STATES.VANILLA;

        return SelectMapSegment(points, id, color, trackId, state, joinPossible, metrics, details, dispatch);
      }).toJS()

    const elements = Object.keys(elms).map((e) => elms[e]);

    const onZoom = (e) => {
      console.log("Zoom In/Out")
      const zoom = e.target.getZoom();
      const maxZoom = e.target.getMaxZoom();
      if (zoom >= maxZoom && !details) {
        dispatch(showDetails());
      } else if (details) {
        dispatch(hideDetails());
      }
    }

    const onMove = (e) => {
      const bnds = e.target.getBounds();
      const bndObj = [
        {
          lat: bnds._northEast.lat,
          lng: bnds._northEast.lng
        }, {
          lat: bnds._southWest.lat,
          lng: bnds._southWest.lng
        }
      ];
      dispatch(updateInternalBounds(bndObj));
    }

    return (
        <MapContainer 
            id='map'
            zoom={ useMaxZoom ? 18 : undefined } 
            scrollWheelZoom={true}
            zoomControl={false}
            minZoom={2}
            bounds={bounds}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                elements
            }
            <ZoomControl position="topright" />
            <ScaleControl position='bottomright' />
            <MapEvents onMoveEnd={onMove} onZoomEnd={onZoom}/>
            <Bounds bounds={bounds}/>
        </MapContainer>
    );
};

const mapStateToProps = (state) => {
    return {
      map: state.get('ui').get('map'),
      bounds: state.get('ui').get('bounds'),
      segments: state.get('tracks').get('segments'),
      details: state.get('ui').get('details')
    }
}
  
Map = connect(mapStateToProps)(Map);  

export default Map;