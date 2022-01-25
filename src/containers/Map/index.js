import React from "react";
import Leaflet from 'leaflet';
import { min, max } from '../../utils';

import { 
    MapContainer,
    TileLayer,
    ZoomControl,
    Polyline
} from "react-leaflet";


const Map = ({ center, zoom, scroll, tracks}) => {
    // const corner1 = Leaflet.latLng(-90, -200);
    // const corner2 = Leaflet.latLng(90, 200);
    // const bounds = Leaflet.latLngBounds(corner1, corner2);

    var bounds = [{lat: Infinity, lon: Infinity}, {lat: -Infinity, lon: -Infinity}];
    
    const elements = tracks.map((track, trackId) => {
        return track.map((segment, segmentId) => {
            const points = segment.points;
            const t = points.map((t) => { return {lat: t.lat, lon: t.lon} });
            t.forEach((elm) => {
                bounds[0].lat = min(bounds[0].lat, elm.lat);
                bounds[0].lon = min(bounds[0].lon, elm.lon);
                bounds[1].lat = max(bounds[1].lat, elm.lat);
                bounds[1].lon = max(bounds[1].lon, elm.lon);
            });

            const handlers = {};

            return (<Polyline opacity={1.0} positions={t} color={ segment.color } key={segmentId} {...handlers} />);
        });
    });

    const ns = elements.reduce((prev, seg) => prev + seg.length, 0);
    if (ns === 0) {
        bounds = [{lat: 67.47492238478702, lng: 225}, {lat: -55.17886766328199, lng: -225}];
    }

    return (
        <MapContainer 
            center={center}
            zoom={zoom} 
            scrollWheelZoom={scroll}
            zoomControl={false}
            minZoom={2}
            maxBoundsViscosity={1.0}
            maxBounds={bounds}  
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {
                elements
            }
            <ZoomControl position="topright" />
        </MapContainer>
    );
};

export default Map;