import React from "react";
import PointPolyline from "./PointPolyline";

const PointDetailMapSegment = (points, trackId, id, color, details) => {
    return (
      <PointPolyline
        opacity={1.0}
        positions={points.slice(1, -1)}
        color={color}
        key={trackId + ' ' + id + 'p'}
        popupInfo={details.toJS()} />
    );
}

export default PointDetailMapSegment;