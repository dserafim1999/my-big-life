import React, { useState } from "react";
import { icon } from 'leaflet'
import { min, max } from '../../utils';
import { PolylineEditor } from 'leaflet-editable-polyline'

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
    const [map, setMap] = useState();

    function addPolyline(coordinates) {

        var polylineOptions = {
                // The user can add new polylines by clicking anywhere on the map:
                newPolylines: true,
                newPolylineConfirmMessage: 'Add a new polyline here?',
                // Show editable markers only if less than this number are in map bounds:
                maxMarkers: 100,
                pointIcon: icon({
                    iconUrl: 'https://raw.githubusercontent.com/tkrajina/leaflet-editable-polyline/master/examples/editmarker.png',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                }),
                newPointIcon: icon({
                    iconUrl: 'https://raw.githubusercontent.com/tkrajina/leaflet-editable-polyline/master/examples/editmarker2.png',
                    iconSize: [12, 12],
                    iconAnchor: [6, 6]
                })
        }

        var polyline = L.Polyline.PolylineEditor(coordinates, polylineOptions).addTo(map);
        map.fitBounds(polyline.getBounds());


        return polyline;
    }

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

            addPolyline(t);
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