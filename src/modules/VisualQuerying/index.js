import React, { useEffect } from "react";
import { connect } from "react-redux";
import { clearCanonicalTrips, clearLocations, clearTrips } from "../../actions/trips";

import QueryResults from "./QueryResults";
import QueryTimeline from "./QueryTimeline"

const VisualQuerying = ({ isVisible, dispatch }) => {
    if (!isVisible) return null;

    useEffect( () => {
        dispatch(clearTrips());
        dispatch(clearCanonicalTrips());
        dispatch(clearLocations())
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