import { fromJS } from "immutable";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { deleteDay, getLife, loadTripsAndLocations, updateView } from "../../actions/general";
import { toggleSegmentInfo, updateActiveLIFE } from "../../actions/segments";
import Card from "../../components/Card";
import { useNavigate } from "react-router-dom";
import Segment from "../../components/TrackList/Segment";

import { ContentState } from 'draft-js';
import SemanticEditor from '../../modules/SemanticEditor';
import decorators from '../SemanticEditor/viewDecorators';
import AsyncButton from "../../components/Buttons/AsyncButton";
import { routeTo } from "../../reducers/utils";
import { MAIN_VIEW, TRACK_PROCESSING } from "../../constants";
import moment from "moment";
import { copyDayToInput } from "../../actions/process";

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const MainView = ({ dispatch, isVisible, showSegmentInfo, activeSegment, activeLIFE, globalLIFE, segments }) => {
    useEffect( () => {
        dispatch(loadTripsAndLocations());
        dispatch(getLife());
    }, []);

    let navigate = useNavigate();

    if (!isVisible) return null;

    const onClose = () =>  {
        dispatch(toggleSegmentInfo(false));
        dispatch(updateActiveLIFE(null));
    }
    
    const onDelete = (e, modifier) => {
        modifier('is-loading');
        const date = moment(activeSegment.getStartTime());
        dispatch(deleteDay(date.format("YYYY-MM-DD")));
        modifier(); 
    }
    
    const onEdit = (e, modifier) => {
        modifier('is-loading');
        const date = moment(activeSegment.getStartTime());
        dispatch(copyDayToInput(date.format("YYYY-MM-DD"))); 
        dispatch(updateView(TRACK_PROCESSING, routeTo(MAIN_VIEW, TRACK_PROCESSING), navigate));
        modifier();
    }

    let segment;
    if (activeSegment) {
        segment = fromJS({segment: activeSegment});
    }

    const state = activeLIFE ? ContentState.createFromText(activeLIFE) : (globalLIFE ? ContentState.createFromText(globalLIFE) : null);

    console.log(state)

    return <>
        { showSegmentInfo && (
                <Card width={400} maxHeight={500} verticalOffset={1} horizontalOffset={1} onClose={onClose}>
                    { activeSegment && <Segment segment={activeSegment} canEdit={false}/>}
                    <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                        <AsyncButton 
                            title='Delete Day'
                            className='is-red'
                            onClick={onDelete} >
                                <DeleteIcon/>
                                Delete
                        </AsyncButton>
                        <AsyncButton 
                            title='Edit Day'
                            className='is-blue'
                            onClick={onEdit} >
                                Edit
                                <EditIcon style={{marginLeft: '10px'}}/>
                        </AsyncButton>
                    </div>
                </Card>
            )   
        }
        { state && 
            <Card width={400} height={400} verticalOffset={97} horizontalOffset={1} title={"LIFE"}>
                    <SemanticEditor
                        readOnly={true}
                        style={{padding: '20px 0 10px 0', height: '310px', overflowY: 'auto'}}
                        state={ state }
                        segments={ segments }
                        dispatch={ dispatch }
                        strategies={ decorators }
                    />
            </Card>
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
        activeLIFE: state.get('tracks').get('activeLIFE'),
        globalLIFE: state.get('general').get('LIFE'),
        segments: state.get('tracks').get('segments')
    };
}
  
export default connect(mapStateToProps)(MainView);