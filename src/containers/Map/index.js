import { connect } from "react-redux";
import PerfMap from "./PerfMap";

const mapStateToProps = (state) => {
    return {
      map: state.get('ui').get('map'),
      bounds: state.get('ui').get('bounds'),
      segments: state.get('tracks').get('segments'),
      details: state.get('ui').get('details')
    }
}
  
const Map = connect(mapStateToProps)(PerfMap);  

export default Map;