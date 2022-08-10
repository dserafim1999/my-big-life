import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import useDraggableScroll from "use-draggable-scroll";
import { loadAllTrips, loadTripsAndLocations } from "../../actions/general";
import { loadTripsInBounds } from "../../actions/tracks";
import Timeline from "../../components/Timeline";
import Card from "../../containers/Card";


const MainView = ({ dispatch, isVisible }) => {
    if (!isVisible) return null;

    dispatch(loadTripsAndLocations());
    //dispatch(loadAllTrips());

    return null;
};

const mapStateToProps = (state) => {
    return {
        isVisible: state.get('general').get('isUIVisible')
    };
}
  
export default connect(mapStateToProps)(MainView);