import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadTripsAndLocations } from "../../actions/general";
import { toggleSegmentInfo } from "../../actions/segments";
import Card from "../../containers/Card";
import Segment from "../../containers/TrackList/Segment";

const MainView = ({ dispatch, isVisible, showSegmentInfo, activeSegment }) => {
    useEffect( () => {
        dispatch(loadTripsAndLocations());
    }, []);

    if (!isVisible) return null;

    const onClose = () =>  {
        dispatch(toggleSegmentInfo(false));
    }

    return <>
        { showSegmentInfo && (
                <Card width={400} height={500} verticalOffset={90} horizontalOffset={99} onClose={onClose}>
                    {/* <SemanticEditor className='is-flexgrow' width='100%' /> */}
                    { activeSegment &&  <Segment segment={activeSegment} canEdit={false}/>}
                </Card>
            )   
        }
    </> 
}

const mapStateToProps = (state) => {
    const activeSegmentId = state.get('tracks').get('activeSegment');
    let segment = state.get('tracks').get('segments').get(activeSegmentId);

    return {
        isVisible: state.get('general').get('isUIVisible'),
        showSegmentInfo: state.get('tracks').get('showInfo'),
        activeSegment: segment
    };
}
  
export default connect(mapStateToProps)(MainView);