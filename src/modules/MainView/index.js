import React, { useEffect } from "react";

import Card from "../../components/Card";
import LIFEViewer from "../../components/LIFEViewer";
import PropTypes from 'prop-types';
import Date from "moment";

import { connect } from "react-redux";
import { deleteDay, getGlobalLife, setSelectedDay, updateView } from "../../actions/general";
import { useNavigate } from "react-router-dom";
import { routeTo } from "../../reducers/utils";
import { MAIN_VIEW, TRACK_PROCESSING } from "../../constants";
import { copyDayToInput } from "../../actions/process";
import { loadTripsAndLocations } from "../../actions/trips";
import { highlightLocation, updateBounds } from "../../actions/map";
import { BoundsRecord } from "../../records";

/**
 * Contains the logic and features for the Main View
 * 
 * @param {function} dispatch Redux store action dispatcher
 * @param {boolean} isVisible Determines if view UI components are visible
 * @param {Date} selectedDay Day that is currently selected
 * @param {object} globalLIFE Global LIFE in JSON representation 
 * @param {boolean} isLifeLoading Whether Global LIFE is being loaded from server
 * @param {string} selectedDayColor Color of the current selected day's trips on the map
 */

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

    const onSearchDay = (day) => {
        dispatch(setSelectedDay(day));
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
        <>
        { globalLIFE && globalLIFE.days.length > 0 && (
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
        )}
        </>
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

MainView.propTypes = {
    /** Redux store action dispatcher */
    dispatch: PropTypes.func,
    /** Determines if view UI components are visible */
    isVisible: PropTypes.bool, 
    /** Day that is currently selected */
    selectedDay: PropTypes.instanceOf(Date),
    /** Global LIFE in JSON representation */
    globalLIFE: PropTypes.object,
    /** Whether Global LIFE is being loaded from server */
    isLifeLoading: PropTypes.bool, 
    /** Color of the current selected day's trips on the map */
    selectedDayColor: PropTypes.string
}
  
export default connect(mapStateToProps)(MainView);