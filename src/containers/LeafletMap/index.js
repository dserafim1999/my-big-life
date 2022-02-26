import { connect } from "react-redux";
import PerfMap from "../../map";

const mapStateToProps = (state) => {
  const history = state.get('tracks').get('history');

  return {
    map: state.get('ui').get('map'),
    bounds: state.get('ui').get('bounds'),
    center: state.get('ui').get('center'),
    highlighted: state.get('ui').get('highlighted'),
    highlightedPoints: state.get('ui').get('highlightedPoints'),
    segments: state.get('tracks').get('segments'),
    details: state.get('ui').get('details'),
    canUndo: history.get('past').count() !== 0,
    canRedo: history.get('future').count() !== 0,
    pointPrompt: state.get('ui').get('pointPrompt')
  }
}
  
const LeafletMap = connect(mapStateToProps)(PerfMap);  

export default LeafletMap;