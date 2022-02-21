import { connect } from "react-redux";
import PerfMap from "../../components/PerfMap";

const mapStateToProps = (state) => {
  const history = state.get('tracks').get('history');
  console.log(history);
  return {
    map: state.get('ui').get('map'),
    bounds: state.get('ui').get('bounds'),
    segments: state.get('tracks').get('segments'),
    details: state.get('ui').get('details'),
    canUndo: history.get('past').count() !== 0,
    canRedo: history.get('future').count() !== 0
  }
}
  
const Map = connect(mapStateToProps)(PerfMap);  

export default Map;