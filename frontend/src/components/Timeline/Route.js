import React from "react";

import PropTypes from 'prop-types';

/**
 * Represents a Route (or part of) on a Timeline.
 *
 * See `Timeline`
 *  
 * @constructor
 * @param {number} startPos startPos position  
 * @param {number} width Route width
 * @param {number} opacity Route color opacity  
 */
const Route = ({ startPos, width, opacity }) => {
    const routeStyle =  {
        position:"absolute",
        left: startPos, 
        backgroundColor: "grey", 
        width: width, 
        height: "5px",
        top: "50%",
        transform: "translateY(-50%)",
        opacity: opacity,
    }

    return (
        <div style={routeStyle}></div>
    );
}

Route.propTypes = {
    /** startPos position */
    startPos: PropTypes.number,
    /** Route width */
    width: PropTypes.number,
    /** Route color opacity */
    opacity: PropTypes.number, 
}

export default Route;
