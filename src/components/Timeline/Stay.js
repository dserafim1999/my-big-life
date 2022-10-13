import React from "react";

import PropTypes from "prop-types";
import moment from "moment";

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
 * @param {number} startPos Start position  
 * @param {string} start Start time  
 * @param {string} end End time  
 * @param {number} width Route width
 * @param {number} opacity Route color opacity  
 * @param {string} legend Stay location name
 * @param {string} color Hex code for Stay's color  
 */
const Stay = ({ startPos, start, end, width, opacity, legend, color }) => {
    const stayStyle =  {
        position:"absolute",
        left: startPos, 
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

    const getLegend = () => {
        if (legend) {
            return <div><b>{legend}</b><br />{moment(start).format("HH:mm")} -> {moment(end).format("HH:mm")}</div>
        } else {
            return <div><i>Expand group to see results.</i></div>
        }
    }

    return (
        <Tooltip title={getLegend()} style={{display: hasLegend() ? "block" : "none"}}>
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
    startPos: PropTypes.number,
    /** Start time */
    start: PropTypes.string,
    /** End time */
    end: PropTypes.string,
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
