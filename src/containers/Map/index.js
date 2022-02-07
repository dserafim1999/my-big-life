import React, { useState } from "react";
import { 
    MapContainer,
    TileLayer,
    ZoomControl,
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

const Map = ({ bounds, tracks, dispatch}) => {
    // creates a map state that will be associated with the MapContainer component to be able to reference the map  
    const [map, setMap] = useState();

    // parses track segments into polylines to display on the map
    const polylines = tracks.map((track) => {
        return track.map((segment) => {
            const points = segment.points;
            const positions = points.map((t) => { return {lat: t.lat, lon: t.lon} });

            // defines the type of polyline to use whether the segment is in editing mode or not
            let Poly;
      
            if (segment.editing) {
                Poly = EditablePolyline
            } else if (segment.splitting || segment.joining || segment.pointDetails) {
                Poly = PointPolyline;
            } else {
                Poly = Polyline;
            }

            // defines the behaviour when editing the polyline to update changes in the state
            const handlers = segment.editing ? {
                onChange: (n, points) => {
                    let {lat, lng} = points[n]._latlng;
                    dispatch(changeSegmentPoint(segment.id, n, lat, lng));
                },
                onRemove: (n) => {
                    dispatch(removeSegmentPoint(segment.id, n));
                },
                onPointAdd: (n, points) => {
                    let {lat, lng} = points[n]._latlng;
                    dispatch(addSegmentPoint(segment.id, n, lat, lng));
                },
                onExtend: (n, points) => {
                    let {lat, lng} = points[n]._latlng;
                    dispatch(extendSegment(segment.id, n, lat, lng));
                }
            } : {};

            if (segment.splitting) {
                handlers.onPointClick = (point, i) => {
                  dispatch(splitSegment(segment.id, i))
                }
            } else if (segment.joining) {
                let p = segment.joinPossible;
                p.forEach((pp) => {
                  if (pp.show === 'END') {
                    handlers.showEnd = (point, i) => {
                      dispatch(joinSegment(segment.id, i, pp))
                    }
                  }
                  if (pp.show === 'START') {
                    handlers.showStart = (point, i) => {
                      dispatch(joinSegment(segment.id, i, pp))
                    }
                  }
                })
              } else if (segment.pointDetails) {
                handlers.popupInfo = points;
            }
            
            return (<Poly positions={positions} color={segment.color} key={segment.id + ' ' + track.id} {...handlers}/>);
            
        });
    });

    bounds = bounds || [{lat: 67.47492238478702, lng: 225}, {lat: -55.17886766328199, lng: -225}];

    return (
        <MapContainer 
            id='map'
            whenCreated={setMap}
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
                polylines
            }
            <ZoomControl position="topright" />
            <Bounds bounds={bounds}/>
        </MapContainer>
    );
};

export default Map;