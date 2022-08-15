import { fromJS } from "immutable";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadTripsAndLocations } from "../../actions/general";
import { toggleSegmentInfo } from "../../actions/segments";
import Card from "../../containers/Card";
import Segment from "../../containers/TrackList/Segment";

import { ContentState } from 'draft-js';
import SemanticEditor from '../../modules/SemanticEditor';
import decorators from '../SemanticEditor/viewDecorators';
import { setLIFE } from "../../actions/process";

const MainView = ({ dispatch, isVisible, showSegmentInfo, activeSegment, activeLIFE }) => {
    useEffect( () => {
        dispatch(loadTripsAndLocations());
    }, []);

    if (!isVisible) return null;

    const onClose = () =>  {
        dispatch(toggleSegmentInfo(false));
    }

    let segment;
    if (activeSegment) {
        segment = fromJS({segment: activeSegment});
    }

    const state = activeLIFE ? ContentState.createFromText(activeLIFE) : null;

    return <>
        { showSegmentInfo && (
                <Card width={400} maxHeight={500} verticalOffset={1} horizontalOffset={1} onClose={onClose}>
                    { activeSegment && <Segment segment={activeSegment} canEdit={false}/>}
                    { activeLIFE && activeSegment && (
                        <SemanticEditor
                            readOnly={true}
                            style={{paddingTop: '25px'}}
                            state={ state }
                            segments={ segment }
                            dispatch={ dispatch }
                            strategies={ decorators }
                            onChange={(stateEditor, ast, text) => {
                                console.log(text)
                            }}
                        />
                    )}
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