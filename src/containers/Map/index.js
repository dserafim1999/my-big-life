import React, { useState } from "react";
import { 
    MapContainer,
    TileLayer,
    ZoomControl,
    LayerGroup,
    Polyline
} from "react-leaflet";

import { 
    changeSegmentPoint, 
    removeSegmentPoint, 
    addSegmentPoint, 
    extendSegment,
    splitSegment,
    joinSegment
} from '../../actions/segments';

import EditablePolyline from "./EditablePolyline";
import PointPolyline from "./PointPolyline";
import Bounds from "./Bounds";
import { connect } from "react-redux";

const EditableSegment = (points, trackId, id, color, dispatch) => {
    return (
      <EditablePolyline
        opacity={1.0}
        positions={points}
        color={color}
        key={trackId + ' ' + id + 'e'}
        onChange={(n, points) => {
          let {lat, lng} = points[n]._latlng;
          dispatch(changeSegmentPoint(id, n, lat, lng));
        }}
        onRemove={(n, points) => {
          dispatch(removeSegmentPoint(id, n))
        }}
        onPointAdd={(n, points) => {
          let {lat, lng} = points[n]._latlng;
          dispatch(addSegmentPoint(id, n, lat, lng));
        }}
        onExtend={(n, points) => {
          let {lat, lng} = points[n]._latlng;
          dispatch(extendSegment(id, n, lat, lng));
        }} />
    );
}
  
const SplitableSegment = (points, trackId, id, color, dispatch) => {
    return (
      <PointPolyline
        opacity={1.0}
        positions={points}
        color={color}
        key={trackId + ' ' + id + 's'}
        onPointClick={(point, i) => {
          dispatch(splitSegment(id, i))
        }} />
    );
}
  
const JoinableSegment = (points, trackId, id, color, possibilities, dispatch) => {
    let handlers = {};
    possibilities.forEach((pp) => {
      if (pp.show === 'END') {
        handlers.showEnd = (point, i) => {
          dispatch(joinSegment(id, i, pp));
        }
      }

      if (pp.show === 'START') {
        handlers.showStart = (point, i) => {
          dispatch(joinSegment(id, i, pp));
        }
      }
    });

    return (
      <PointPolyline
        opacity={1.0}
        positions={points}
        color={color}
        key={trackId + ' ' + id + 'j'}
        {...handlers} />
    );
}

const PointDetailSegment = (points, trackId, id, color, details) => {
    return (
      <PointPolyline
        opacity={1.0}
        positions={points}
        color={color}
        key={trackId + ' ' + id + 'p'}
        popupInfo={details.toJS()} />
    );
}

const mapStates = {
    NORMAL: 0,
    EDITING: 1,
    SPLITING: 2,
    JOINING: 3,
    POINT_DETAILS: 4
}

const ComplexMapSegments = (points, id, color, trackId, state, joinPossible, metrics, dispatch) => {
  switch (state) {
      case mapStates.EDITING:
        return EditableSegment(points, trackId, id, color, dispatch);
      case mapStates.SPLITING:
        return SplitableSegment(points, trackId, id, color, dispatch);
      case mapStates.JOINING:
        return JoinableSegment(points, trackId, id, color, joinPossible, dispatch);
      case mapStates.POINT_DETAILS:
        return PointDetailSegment(points, trackId, id, color, metrics.get('points'));
      default:
        return null;
    }
}

const SelectMapSegment = (points, id, color, trackId, state, joinPossible, metrics, dispatch) => {
    return (
      <LayerGroup key={trackId + ' ' + id} >
        <Polyline opacity={1.0} positions={points} color={ color } key={trackId + ' ' + id}/>
        {ComplexMapSegments(points, id, color, trackId, state, joinPossible, metrics, dispatch)}
      </LayerGroup>
    )
}

const segmentStateSelector = (segment) => {
    if (segment.get('editing')) {
      return mapStates.EDITING
    } else if (segment.get('splitting')) {
      return mapStates.SPLITING
    } else if (segment.get('joining')) {
      return mapStates.JOINING
    } else if (segment.get('pointDetails')) {
      return mapStates.POINT_DETAILS
    } else {
      return mapStates.NORMAL;
    }
}

let Map = ({ bounds, map, segments, dispatch}) => {
    const elms = segments.filter((segment) => segment.get('display')).map((segment) => {
        const points = segment.get('points').toJS();
        const state = segmentStateSelector(segment);
        const color = segment.get('color');
        const id = segment.get('id');
        const trackId = segment.get('trackId');
        const joinPossible = segment.get('joinPossible');
        const metrics = segment.get('metrics');
        
        return SelectMapSegment(points, id, color, trackId, state, joinPossible, metrics, dispatch);
      }).toJS()

    const elements = Object.keys(elms).map((e) => elms[e]);
    bounds = bounds || [{lat: 67.47492238478702, lng: 225}, {lat: -55.17886766328199, lng: -225}];

    return (
        <MapContainer 
            id='map'
            zoom={4} 
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
            <Bounds bounds={bounds}/>
        </MapContainer>
    );
};

const mapStateToProps = (state) => {
    return {
      map: state.get('ui').get('map'),
      bounds: state.get('ui').get('bounds'),
      segments: state.get('tracks').get('segments')
    }
}
  
Map = connect(mapStateToProps)(Map);  

export default Map;