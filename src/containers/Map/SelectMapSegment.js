import React from 'react';
import { LayerGroup, Polyline } from 'react-leaflet';
import ComplexMapSegments from './ComplexMapSegments';

const SelectMapSegment = (points, id, color, trackId, state, joinPossible, metrics, details, dispatch) => {
    const complex = details ? ComplexMapSegments(points, id, color, trackId, state, joinPossible, metrics, dispatch) : null; 
    return (
      <LayerGroup key={trackId + ' ' + id} >
        <Polyline opacity={1.0} positions={points} color={ color } key={trackId + ' ' + id}/>
        {complex}
      </LayerGroup>
    )
}

export default SelectMapSegment;