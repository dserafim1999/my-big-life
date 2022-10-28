import React, { useEffect } from "react";

import { connect } from "react-redux";
import { updateBounds } from "../../actions/map";
import { clearCanonicalTrips, clearLocations, clearTrips } from "../../actions/trips";
import { BoundsRecord } from "../../records";

import QueryResults from "./QueryResults";
import QueryTimeline from "./QueryTimeline";
import PropTypes from 'prop-types';

/**
 * Contains the logic and features for the Visual Queries View
 * 
 * @param {function} dispatch Redux store action dispatcher
 * @param {boolean} isVisible Determines if view UI components are visible
 */

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
  
VisualQuerying.propTypes = {
    /** Redux store action dispatcher */
    dispatch: PropTypes.func,
    /** Determines if view UI components are visible */
    isVisible: PropTypes.bool, 
}

export default connect(mapStateToProps)(VisualQuerying);