import React from "react";

import PropTypes from "prop-types";

import { Tooltip } from "@mui/material";

const legendStyle = {
    color: "white",
    fontSize: "12px",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%,-50%)",
    textAlign: "center",
    textOverflow: "ellipsis",
    overflow: "hidden",
    width: "100%",
    padding: "5px"
}

/**
 * Represents a Stay (or part of) on a Timeline.
 *
 * See `Timeline`
 *  
 * @constructor
 * @param {number} start Start position  
 * @param {number} width Route width
 * @param {number} opacity Route color opacity  
 * @param {string} legend Stay location name
 * @param {string} color Hex code for Stay's color  
 */
const Stay = ({ start, width, opacity, legend, color }) => {
    const stayStyle =  {
        position:"absolute",
        left: start, 
        backgroundColor: color, 
        width: width, 
        height: "40px",
        top: "50%",
        transform: "translateY(-50%)",
        opacity: opacity,
    }
    
    const hasLegend = () => {
        return legend !== undefined && legend !== "";
    }

    return (
        <Tooltip title={legend} style={{display: hasLegend() ? "block" : "none"}}>
            <div style={stayStyle}>
                { legend &&
                    <span style={legendStyle}>{legend}</span>
                }
            </div>
        </Tooltip>
    );
}

Stay.propTypes = {
    /** Start position */
    start: PropTypes.number,
    /** Route width */
    width: PropTypes.number,
    /** Route color opacity */
    opacity: PropTypes.number, 
    /**Stay location name */
    legend: PropTypes.string, 
    /** Hex code for Stay's color */  
    color: PropTypes.string 
}
  
export default Stay;
