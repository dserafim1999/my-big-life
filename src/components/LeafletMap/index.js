import React from 'react';
import { connect } from "react-redux";
import PerfMap from "../../modules/Map";

const mapStateToProps = (state) => {
  const history = state.get('tracks').get('history');

  return {
    map: state.get('map').get('provider'),
    activeView: state.get('general').get('activeView'),
    bounds: state.get('map').get('bounds'),
    center: state.get('map').get('center'),
    pointPrompt: state.get('map').get('pointPrompt'),
    highlighted: state.get('map').get('highlighted'),
    highlightedPoints: state.get('map').get('highlightedPoints'),
    segments: state.get('tracks').get('segments'),
    locations: state.get('tracks').get('locations'),
    canonicalTrips: state.get('tracks').get('canonicalTrips'),
    canUndo: history.get('past').count() !== 0,
    canRedo: history.get('future').count() !== 0,
    segmentsArePoints: !!state.get('tracks').get('canonical')
  }
}

const LeafletMap = connect(mapStateToProps)(PerfMap);

export default LeafletMap;