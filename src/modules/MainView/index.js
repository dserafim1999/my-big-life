import { fromJS } from "immutable";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { loadTripsAndLocations, updateView } from "../../actions/general";
import { toggleSegmentInfo } from "../../actions/segments";
import Card from "../../containers/Card";
import { useNavigate } from "react-router-dom";
import Segment from "../../containers/TrackList/Segment";

import { ContentState } from 'draft-js';
import SemanticEditor from '../../modules/SemanticEditor';
import decorators from '../SemanticEditor/viewDecorators';
import AsyncButton from "../../components/Buttons/AsyncButton";
import { routeTo } from "../../reducers/utils";
import { MAIN_VIEW, TRACK_PROCESSING } from "../../constants";
import moment from "moment";
import { copyDayToInput } from "../../actions/process";

const MainView = ({ dispatch, isVisible, showSegmentInfo, activeSegment, activeLIFE }) => {
    useEffect( () => {
        dispatch(loadTripsAndLocations());
    }, []);

    let navigate = useNavigate();

    if (!isVisible) return null;

    const onClose = () =>  {
        dispatch(toggleSegmentInfo(false));
    }

    const onEdit = () => {
        const date = moment(activeSegment.getStartTime());
        dispatch(copyDayToInput(date.format("YYYY-MM-DD")));
        dispatch(updateView(TRACK_PROCESSING, routeTo(MAIN_VIEW, TRACK_PROCESSING), navigate));
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
                            style={{padding: '20px 0 10px 0'}}
                            state={ state }
                            segments={ segment }
                            dispatch={ dispatch }
                            strategies={ decorators }
                            onChange={(stateEditor, ast, text) => {
                                console.log(text)
                            }}
                        />
                    )}
                    <AsyncButton 
                        style={{display: "flow-root"}}
                        title='Edit Day'
                        className='is-blue'
                        onClick={(e, modifier) => {
                            modifier('is-loading');
                            onEdit();
                            modifier();
                        }} >
                            Edit Day
                    </AsyncButton>
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