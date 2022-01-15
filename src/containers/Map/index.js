import React from "react";
import Leaflet from 'leaflet';

import { 
    MapContainer,
    TileLayer,
    ZoomControl,
    Polyline
} from "react-leaflet";


const Map = ({ center, zoom, scroll, tracks}) => {
    const corner1 = Leaflet.latLng(-90, -200);
    const corner2 = Leaflet.latLng(90, 200);
    const bounds = Leaflet.latLngBounds(corner1, corner2);

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
                tracks.map((track, i) => {
                    const t = track[0].map((t)=>{
                        return { lat:Number(t.lat), lon:Number(t.lon) };
                    });
                    
                    return (
                        <Polyline positions={t} key={i} />
                    );
                })
            }
            <ZoomControl position="topright" />
        </MapContainer>
    );
};

export default Map;