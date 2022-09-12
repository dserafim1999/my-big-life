import React, { useEffect } from "react";

import Card from "../../components/Card";
import SemanticEditor from '../../modules/SemanticEditor';
import decorators from '../SemanticEditor/viewDecorators';
import AsyncButton from "../../components/Buttons/AsyncButton";
import moment from "moment";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { fromJS } from "immutable";
import { connect } from "react-redux";
import { deleteDay, getLife, loadTripsAndLocations, updateView } from "../../actions/general";
import { useNavigate } from "react-router-dom";
import { ContentState } from 'draft-js';
import { routeTo } from "../../reducers/utils";
import { MAIN_VIEW, TRACK_PROCESSING } from "../../constants";
import { copyDayToInput } from "../../actions/process";
import { updateActiveLIFE, toggleDayInfo } from "../../actions/trips";

const MainView = ({ dispatch, isVisible, showSegmentInfo, activeDay, activeLIFE, globalLIFE, segments }) => {
    useEffect( () => {
        dispatch(loadTripsAndLocations());
        dispatch(getLife());
    }, []);

    let navigate = useNavigate();

    if (!isVisible) return null;

    const onClose = () =>  {
        dispatch(toggleDayInfo(false));
        dispatch(updateActiveLIFE(null));
    }
    
    const onDelete = (e, modifier) => {
        modifier('is-loading');
        dispatch(deleteDay(activeDay.format("YYYY-MM-DD")));
        modifier(); 
    }
    
    const onEdit = (e, modifier) => {
        modifier('is-loading');
        dispatch(copyDayToInput(activeDay.format("YYYY-MM-DD"))); 
        dispatch(updateView(TRACK_PROCESSING, routeTo(MAIN_VIEW, TRACK_PROCESSING), navigate));
        modifier();
    }

    const state = activeLIFE ? ContentState.createFromText(activeLIFE) : (globalLIFE ? ContentState.createFromText(globalLIFE) : null);

    return <>
        { showSegmentInfo && (
                <Card width={400} maxHeight={500} verticalOffset={1} horizontalOffset={1} onClose={onClose} title={activeDay.format('DD/MM/YYYY')}>
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
    return {
        isVisible: state.get('general').get('isUIVisible'),
        showSegmentInfo: state.get('trips').get('showInfo'),
        activeDay: state.get('trips').get('activeDay'),
        activeLIFE: state.get('trips').get('activeLIFE'),
        //globalLIFE: state.get('general').get('LIFE'),
        segments: state.get('tracks').get('segments')
    };
}
  
export default connect(mapStateToProps)(MainView);