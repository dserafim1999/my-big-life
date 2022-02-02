import React, { useState } from "react";
import { 
    MapContainer,
    TileLayer,
    ZoomControl,
    Polyline
} from "react-leaflet";

import { min, max } from "../../utils";
import EditablePolyline from "./EditablePolyline";
import { changeSegmentPoint, removeSegmentPoint, addSegmentPoint, extendSegment } from '../../actions';

const Map = ({ center, zoom, scroll, tracks, dispatch}) => {
    // creates a map state that will be associated with the MapContainer component to be able to reference the map  
    const [map, setMap] = useState();

    var bounds = [{lat: Infinity, lon: Infinity}, {lat: -Infinity, lon: -Infinity}]

    // parses track segments into polylines to display on the map
    const polylines = tracks.map((track) => {
        return track.map((segment) => {
            const points = segment.points;
            const positions = points.map((t) => { return {lat: t.lat, lon: t.lon} });

            positions.forEach((elm) => {
                bounds[0].lat = min(bounds[0].lat, elm.lat)
                bounds[0].lon = min(bounds[0].lon, elm.lon)
                bounds[1].lat = max(bounds[1].lat, elm.lat)
                bounds[1].lon = max(bounds[1].lon, elm.lon)
            });

            // defines the type of polyline to use whether the segment is in editing mode or not
            const Poly = segment.editing? EditablePolyline : Polyline;

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

            return (<Poly positions={positions} color={segment.color} key={segment.id} {...handlers}/>);
            
        });
    });

    const ns = polylines.reduce((prev, seg) => prev + seg.length, 0)
    if (ns === 0) {
      bounds = [{lat: 67.47492238478702, lng: 225}, {lat: -55.17886766328199, lng: -225}]
    }

    return (
        <MapContainer 
            whenCreated={setMap}
            center={[50, 25]}
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
        </MapContainer>
    );
};

export default Map;