import React, { useState } from "react";
import { min, max } from '../../utils';
import { 
    MapContainer,
    TileLayer,
    ZoomControl,
    Polyline
} from "react-leaflet";

import EditablePolyline from "./EditablePolyline";
import { PolyUtil } from "leaflet";


const Map = ({ center, zoom, scroll, tracks, dispatch}) => {
    var bounds = [{lat: Infinity, lon: Infinity}, {lat: -Infinity, lon: -Infinity}];
    const [map, setMap] = useState();

    const elements = tracks.map((track, trackId) => {
        return track.map((segment) => {
            const points = segment.points;
            const t = points.map((t) => { return {lat: t.lat, lon: t.lon} });
            t.forEach((elm) => {
                bounds[0].lat = min(bounds[0].lat, elm.lat);
                bounds[0].lon = min(bounds[0].lon, elm.lon);
                bounds[1].lat = max(bounds[1].lat, elm.lat);
                bounds[1].lon = max(bounds[1].lon, elm.lon);
            });

            const handlers = {};

            //const Poly = segment.pointEditing? EditablePolyline : Polyline;
            const Poly =  EditablePolyline;
            
            return (<Poly positions={t} color={segment.color} key={segment.id}/>);
            
        });
    });

    return (
        <MapContainer 
            whenCreated={setMap}
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