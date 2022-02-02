import { useEffect } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import { PolylineEditor } from 'leaflet-editable-polyline';
import L, { icon } from 'leaflet';

// Custom Polyline that allows for editing
const EditablePolyline = (props) => {
    const context = useLeafletContext();

    useEffect(() => {
        var polylineOptions = {
            // shows editable markers only if less than this number are in map bounds
            // maxMarkers: 100,
            // icon for existing point on polyline
            pointIcon: icon({
                iconUrl: '/pointIcon.svg', //TODO change marker 
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            }),
            // icon for new point on polyline
            newPointIcon: icon({
                iconUrl: '/newPointIcon.svg', //TODO change marker
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            }),
        }

        // adds props to list of our custom editable polyline options
        for (let key in props) {
            if (props.hasOwnProperty(key)) {
                polylineOptions[key] = props[key]
            }
        }

        // creates an editable polyline 
        const polyline = L.Polyline.PolylineEditor(props.positions, polylineOptions);
        
        // gets map from the current leaflet context
        const container = context.layerContainer || context.map;

        // adds polyline to map
        container.addLayer(polyline);

        return () => {
            // removes polyline on state change to re-render
            container.removeLayer(polyline);
        }
    })

    // since a return is expected, and leaflet sorts out all of the rendering, returns null
    return null;
}

export default EditablePolyline;