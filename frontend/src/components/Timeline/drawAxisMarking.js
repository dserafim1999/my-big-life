import React from "react";

import PropTypes from 'prop-types';

/**
 * Draws an axis marking on the Timeline's main axis.
 * 
 * See `Timeline`
 * 
 * @function
 * @param {number} index Used for div key
 * @param {number} pos Position relative to timeline start
 * @param {number} height Marking height
 * @param {number} width Marking width
 * @param {boolean} showTimeLegend Display time relative to marking
 * @param {boolean} isStart If true, marking represents the start of the axis
 * @param {boolean} isEnd If true, marking represents the end of the axis
 * @returns {HTMLElement} Axis marking 
 */
const drawAxisMarking = (index, pos, height, width, showTimeLegend, isStart=false, isEnd=false) => {
    const isLimit = isStart || isEnd; 
    const markingStyle = {
        borderLeft: width+"px solid "+ (isLimit ? "grey" : "lightgrey"),
        height: height+"px",
        position: "absolute",
        left: pos+"px",
        top: "50%",
        transform: "translateY(-50%)",
        padding: "0px",
        zIndex: isLimit? "100" : ""
    }

    return (
        <div key={index} style={markingStyle}>
            {
                isLimit && showTimeLegend &&
                <span style={{fontSize: '10px',position: 'relative',top: '80%',right: '60%'}}> 
                    {isStart? "00:00" : "23:59"}
                </span>
            }
        </div>
    );
}

drawAxisMarking.propTypes = {
    /** Used for div key */
    index: PropTypes.number,
    /** Position relative to timeline start */
    pos: PropTypes.number,
    /** Marking height */
    height: PropTypes.number,
    /** Marking width */
    width: PropTypes.number,
    /** Display time relative to marking */
    showTimeLegend: PropTypes.bool,
    /** If true, marking represents the start of the axis */
    isStart: PropTypes.bool,
    /** If true, marking represents the end of the axis */
    isEnd: PropTypes.bool 
}

export default drawAxisMarking;