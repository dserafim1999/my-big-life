import React, { useEffect } from "react";

import Card from "../../components/Card";
import AsyncButton from "../../components/Buttons/AsyncButton";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LIFEViewer from "../../components/LIFEViewer";

import { connect } from "react-redux";
import { deleteDay, getGlobalLife, updateView } from "../../actions/general";
import { useNavigate } from "react-router-dom";
import { routeTo } from "../../reducers/utils";
import { MAIN_VIEW, TRACK_PROCESSING } from "../../constants";
import { copyDayToInput } from "../../actions/process";
import { loadTripsAndLocations, toggleDayInfo } from "../../actions/trips";
import { highlightLocation } from "../../actions/map";

const MainView = ({ dispatch, isVisible, showSegmentInfo, selectedDay, globalLIFE, isLifeLoading }) => {
    useEffect( () => {
        dispatch(loadTripsAndLocations());
        dispatch(getGlobalLife());
    }, []);

    let navigate = useNavigate();

    if (!isVisible) return null;

    const onClose = () =>  {
        dispatch(toggleDayInfo(false));
    }
    
    const onDelete = (e, modifier) => {
        modifier('is-loading');
        dispatch(deleteDay(selectedDay.format("YYYY-MM-DD")));
        modifier(); 
    }
    
    const onEdit = (e, modifier) => {
        modifier('is-loading');
        dispatch(copyDayToInput(selectedDay.format("YYYY-MM-DD"))); 
        dispatch(updateView(TRACK_PROCESSING, routeTo(MAIN_VIEW, TRACK_PROCESSING), navigate));
        modifier();
    }

    const life = globalLIFE;

    return <>
        { showSegmentInfo && (
                <Card width={400} maxHeight={500} verticalOffset={1} horizontalOffset={1} onClose={onClose} title={selectedDay.format('DD/MM/YYYY')}>
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
        <Card width={400} height={400} verticalOffset={97} horizontalOffset={1}>
                {/* <SemanticEditor
                    readOnly={true}
                    style={{padding: '20px 0 10px 0', height: '310px', overflowY: 'auto'}}
                    state={ state }
                    segments={ segments }
                    dispatch={ dispatch }
                    strategies={ decorators }
                /> */}
                <LIFEViewer 
                    life={life}
                    onDayClick={(day) => dispatch(toggleDayInfo(true, day))} 
                    onLocationClick={(loc) => dispatch(highlightLocation(loc))}
                    isLoading={isLifeLoading}
                />
        </Card>
    </> 
}

const mapStateToProps = (state) => {
    return {
        isVisible: state.get('general').get('isUIVisible'),
        showSegmentInfo: state.get('trips').get('showInfo'),
        selectedDay: state.get('general').get('selectedDay'),
        isLifeLoading: state.get('general').get('loading').has('life-viewer'),
        globalLIFE: state.get('general').get('LIFE')
    };
}
  
export default connect(mapStateToProps)(MainView);