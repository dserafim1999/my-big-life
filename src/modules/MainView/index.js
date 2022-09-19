import React, { useEffect } from "react";

import Card from "../../components/Card";
import LIFEViewer from "../../components/LIFEViewer";

import { connect } from "react-redux";
import { deleteDay, getGlobalLife, setSelectedDay, updateView } from "../../actions/general";
import { useNavigate } from "react-router-dom";
import { routeTo } from "../../reducers/utils";
import { MAIN_VIEW, TRACK_PROCESSING } from "../../constants";
import { copyDayToInput } from "../../actions/process";
import { loadTripsAndLocations } from "../../actions/trips";
import { highlightLocation, updateBounds } from "../../actions/map";
import { BoundsRecord } from "../../records";

const MainView = ({ dispatch, isVisible, selectedDay, globalLIFE, isLifeLoading, selectedDayColor }) => {
    useEffect( () => {
        dispatch(loadTripsAndLocations());
        dispatch(getGlobalLife());
        dispatch(updateBounds(new BoundsRecord().setWithCoords(90, -200, -90, 200)));
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
        dispatch(setSelectedDay(false));
    }

    const onSearchDay = () => {
        dispatch(setSelectedDay(false));
    }

    const onDayClick = (day) => {
        if(day.isSame(selectedDay)) {
            dispatch(setSelectedDay(false));
        } else {
            dispatch(setSelectedDay(day));
        }
    }

    const onLocationClick = (loc) => {
        dispatch(highlightLocation(loc));
    }

    return (
        <Card width={400} height={500} verticalOffset={3} horizontalOffset={1}>
            <LIFEViewer 
                life={globalLIFE}
                header={true}
                selectedDay={selectedDay}
                selectedDayColor={selectedDayColor}
                onDayClick={(day) => onDayClick(day)} 
                onLocationClick={(loc) => onLocationClick(loc)}
                onDeselectDay={onDeselectDay}
                onSearchDay={onSearchDay}
                onEditDay={onEditDay}
                onDeleteDay={onDeleteDay}
                isLifeLoading={isLifeLoading}
            />
        </Card>
    );
}

const mapStateToProps = (state) => {
    return {
        isVisible: state.get('general').get('isUIVisible'),
        selectedDay: state.get('general').get('selectedDay'),
        selectedDayColor: state.get('general').get('selectedDayColor'),
        isLifeLoading: state.get('general').get('loading').has('life-viewer'),
        globalLIFE: state.get('general').get('LIFE')
    };
}
  
export default connect(mapStateToProps)(MainView);