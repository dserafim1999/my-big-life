import React, { useEffect } from "react";
import { connect } from "react-redux";
import { updateBounds } from "../../actions/map";
import { clearCanonicalTrips, clearLocations, clearTrips } from "../../actions/trips";
import { BoundsRecord } from "../../records";

import QueryResults from "./QueryResults";
import QueryTimeline from "./QueryTimeline"

const VisualQuerying = ({ isVisible, dispatch }) => {
    if (!isVisible) return null;

    useEffect( () => {
        dispatch(clearTrips());
        dispatch(clearCanonicalTrips());
        dispatch(clearLocations());
        dispatch(updateBounds(new BoundsRecord().setWithCoords(90, -200, -90, 200)));

    }, []);

    return (
        <>
            <QueryTimeline/>
            <QueryResults/>
        </>
    )
};

const mapStateToProps = (state) => {
    return {
        isVisible: state.get('general').get('isUIVisible')
    };
}
  
export default connect(mapStateToProps)(VisualQuerying);