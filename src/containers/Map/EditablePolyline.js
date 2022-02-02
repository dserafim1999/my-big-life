import { useEffect } from 'react';
import { useLeafletContext } from '@react-leaflet/core';
import { PolylineEditor } from 'leaflet-editable-polyline';
import L, { icon } from 'leaflet';

const EditablePolyline = (props) => {
    const context = useLeafletContext();

    useEffect(() => {
        var polylineOptions = {
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
            }),
            color: props.color
        }

        const polyline = L.Polyline.PolylineEditor(props.positions, polylineOptions);
        const container = context.layerContainer || context.map;
        container.addLayer(polyline);

        return () => {
            container.removeLayer(polyline);
        }
    })

    return null;
}

export default EditablePolyline;