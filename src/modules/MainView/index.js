import React, { useEffect } from "react";

import Card from "../../components/Card";
import LIFEViewer from "../../components/LIFEViewer";

import { connect } from "react-redux";
import { deleteDay, getGlobalLife, updateView } from "../../actions/general";
import { useNavigate } from "react-router-dom";
import { routeTo } from "../../reducers/utils";
import { MAIN_VIEW, TRACK_PROCESSING } from "../../constants";
import { copyDayToInput } from "../../actions/process";
import { loadTripsAndLocations, toggleDayInfo } from "../../actions/trips";
import { highlightLocation } from "../../actions/map";

const MainView = ({ dispatch, isVisible, selectedDay, globalLIFE, isLifeLoading }) => {
    useEffect( () => {
        dispatch(loadTripsAndLocations());
        dispatch(getGlobalLife());
    }, []);

    let navigate = useNavigate();

    if (!isVisible) return null;
    
    const onDeleteDay = () => {
        dispatch(deleteDay(selectedDay.format("YYYY-MM-DD")));
    }
    
    const onEditDay = () => {
        dispatch(copyDayToInput(selectedDay.format("YYYY-MM-DD"))); 
        dispatch(updateView(TRACK_PROCESSING, routeTo(MAIN_VIEW, TRACK_PROCESSING), navigate));
    }

    const onDeselectDay = () => {
        dispatch(toggleDayInfo(false));
    }

    const onSearchDay = () => {
        dispatch(toggleDayInfo(false));
    }

    const onDayClick = (day) => {
        if(day.isSame(selectedDay)) {
            dispatch(toggleDayInfo(false));
        } else {
            dispatch(toggleDayInfo(true, day));
        }
    }

    const onLocationClick = (loc) => {
        dispatch(highlightLocation(loc));
    }

    return (
        <Card width={400} height={500} verticalOffset={97} horizontalOffset={99}>
            <LIFEViewer 
                life={globalLIFE}
                header={true}
                selectedDay={selectedDay}
                onDayClick={(day) => onDayClick(day)} 
                onLocationClick={(loc) => onLocationClick(loc)}
                onDeselectDay={onDeselectDay}
                onSearchDay={onSearchDay}
                onEditDay={onEditDay}
                onDeleteDay={onDeleteDay}
                isLoading={isLifeLoading}
            />
        </Card>
    );
}

const mapStateToProps = (state) => {
    return {
        isVisible: state.get('general').get('isUIVisible'),
        selectedDay: state.get('general').get('selectedDay'),
        isLifeLoading: state.get('general').get('loading').has('life-viewer'),
        globalLIFE: state.get('general').get('LIFE')
    };
}
  
export default connect(mapStateToProps)(MainView);