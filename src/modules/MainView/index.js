import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadTripsAndLocations } from "../../actions/general";
import { toggleSegmentInfo } from "../../actions/segments";
import Card from "../../containers/Card";
import Segment from "../../containers/TrackList/Segment";
import decorators from '../../modules/SemanticEditor/decorators';
import SemanticEditor from '../../modules/SemanticEditor';

const MainView = ({ dispatch, isVisible, showSegmentInfo, activeSegment, activeLIFE }) => {
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
                    { activeLIFE && (
                        <SemanticEditor
                            state={ activeLIFE }
                            segments={ Map(activeSegment) }
                            dispatch={ dispatch }
                            strategies={ decorators }
                        />
                    )}
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
        activeSegment: segment,
        activeLIFE: state.get('tracks').get('activeLIFE') 
    };
}
  
export default connect(mapStateToProps)(MainView);