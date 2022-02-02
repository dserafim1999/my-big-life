import React, { useState } from "react";
import { 
    MapContainer,
    TileLayer,
    ZoomControl,
    Polyline
} from "react-leaflet";

import EditablePolyline from "./EditablePolyline";
import { changeSegmentPoint, removeSegmentPoint, addSegmentPoint, extendSegment } from '../../actions';

const Map = ({ center, zoom, scroll, tracks, dispatch}) => {
    // creates a map state that will be associated with the MapContainer component to be able to reference the map  
    const [map, setMap] = useState();

    // parses track segments into polylines to display on the map
    const polylines = tracks.map((track) => {
        return track.map((segment) => {
            const points = segment.points;
            const positions = points.map((t) => { return {lat: t.lat, lon: t.lon} });

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

    return (
        <MapContainer 
            whenCreated={setMap}
            center={center}
            zoom={zoom} 
            scrollWheelZoom={scroll}
            zoomControl={false}
            minZoom={2}
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