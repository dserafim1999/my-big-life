import { useEffect } from "react";
import { useMap } from "react-leaflet";

const Bounds = ({ bounds }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    map.fitBounds(bounds);
  }, [map, bounds]);

  return null;
}

export default Bounds;