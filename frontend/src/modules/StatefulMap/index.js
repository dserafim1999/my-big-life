import { connect } from "react-redux";
import Map from "../../components/Map";

/**
 * Container that sets up data for the Map module
 */

const mapStateToProps = (state) => {
  const history = state.get('tracks').get('history');

  return {
    map: state.get('map').get('provider'),
    activeView: state.get('general').get('activeView'),
    bounds: state.get('map').get('bounds'),
    center: state.get('map').get('center'),
    zoom: state.get('map').get('zoom'),
    pointPrompt: state.get('map').get('pointPrompt'),
    highlighted: state.get('map').get('highlighted'),
    highlightedPoints: state.get('map').get('highlightedPoints'),
    segments: state.get('tracks').get('segments'),
    trips: state.get('trips').get('trips'),
    locations: state.get('trips').get('locations'),
    canonicalTrips: state.get('trips').get('canonicalTrips'),
    canUndo: history.get('past').count() !== 0,
    canRedo: history.get('future').count() !== 0,
    selectedDay: state.get('general').get('selectedDay'),
    segmentsArePoints: !!state.get('tracks').get('canonical')
  }
}

const StatefulMap = connect(mapStateToProps)(Map);

export default StatefulMap;