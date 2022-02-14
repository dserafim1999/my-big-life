import { useEffect } from "react";
import { useMap, useMapEvents } from "react-leaflet";

const MapEvents = ({ onMoveEnd, onZoomEnd }) => {
  const map = useMap();

  useMapEvents({
    moveend(e) {
      onMoveEnd(e);
    },
    zoomend(e) {
      onZoomEnd(e);
    }
  });

  return null;
}

export default MapEvents;