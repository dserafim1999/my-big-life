import React, { useEffect, useState, useRef } from "react";

import moment from "moment";
import Stay from "./Stay";
import Route from "./Route";
import PropTypes from 'prop-types';

import drawAxisMarking from './drawAxisMarking';
import useDimensions from "../../utils/useDimensions";
import useDraggableScroll from "use-draggable-scroll";
import { normalize, clamp } from "../../utils";
import { MINUTES_IN_DAY } from "../../constants";

/**
 * Timeline that represents data for Stays and Routes between them for a certain day.
 * 
 * @constructor
 * @param {object} render Dictionary that contains render data for Stays and Routes
 * @param {number} height Timeline height
 * @param {boolean} showTimeLegend If true, displays time below markings on the extremities
 * @param {boolean} showStayLegend If true, displays Stay name in the center of a Stay
 * @param {string} color Hex code for Timeline Stays' color
 * @param {function} onClick Behaviour when Timeline is clicked 
 */
const Timeline = ({ render, height, showTimeLegend=false, showStayLegend=false, color, onClick }) => {
    const [zoomLevel, setZoomLevel] = useState(1); 
    const ref = useRef(null);
    const { width } = useDimensions(ref);
    const { onMouseDown } = useDraggableScroll(ref);
    const minZoom = 1, maxZoom = 5, zoomIncrement = 0.2;
    
    const buffer = 30;
    const timelineWidth = (width-2*buffer) * zoomLevel;
    const startPos = buffer;
    const endPos = timelineWidth+buffer;

    useEffect(() => {
        const onScroll = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }

            const direction = (e.deltaY/Math.abs(e.deltaY));
            var relativePos = clamp(e.offsetX/width, 0, 1).toFixed(1);
            
            if (ref.current) ref.current.scrollLeft += width * relativePos;
            limitZoomLevel(zoomLevel - (direction) * zoomIncrement);
        };
        
        window.removeEventListener('wheel', onScroll);
        window.addEventListener('wheel', onScroll, { passive: false });
        return () => window.removeEventListener('wheel', onScroll);
    });

    const limitZoomLevel = (zoom) => {
        if (zoom < minZoom) {
            zoom = minZoom;
        } else if (zoom > maxZoom) {
            zoom = maxZoom;
        }

        setZoomLevel(zoom);
    }

    var timelineStyle = {
        width: "100%", 
        height: height + "px", 
        position: "relative",
        overflow: "hidden"
    } 

    const getMaxFreq = (array) => {
        return Math.max(...array.map(o => o.freq));
    } 

    const getOpacityValue = (value, maxValue) => {
        return (value/maxValue) * 0.9;
    }
    
    const getMinutes = (date) => {
        date = moment.utc(date)
        return date.hour() * 60 + date.minutes();
    } 

    const getTimelineCoords = (time) => {
        const minutes = getMinutes(time);
        return normalize(minutes, 0, MINUTES_IN_DAY - 1, startPos, endPos);
    }

    const draw = (type, block) => {
        if (type === undefined) return;
        const maxFreq = getMaxFreq(type);
        
        return (
            <div className={type} style={{position: "absolute", display: "flex", height: "100%"}}>
                {
                    type.flatMap((span, i) => {
                        const _startPos = getTimelineCoords(span.start);
                        const _endPos = getTimelineCoords(span.end);
                        
                        if (_startPos < startPos || _endPos > endPos) return [];
                        
                        const spanWidth = _endPos - _startPos;
                        const opacity = getOpacityValue(span.freq, maxFreq);
                        
                        return block === "stay" ? 
                            [<Stay key={i} start={span.start} end={span.end} startPos={_startPos} width={spanWidth} opacity={opacity} legend={showStayLegend ? span.location : ""} color={color}/>] : 
                            [<Route key={i} startPos={_startPos} width={spanWidth} opacity={opacity}/>];
                    })
                }
            </div>
        );
    }

    const renderData = () => {
        return (
            <div className="renderContainer">
                { draw(render.stays, "stay") }
                { draw(render.routes, "route") }
            </div>
        )
    }

    const renderAxis = () => {
        return (
            <>
                <hr className="horizontalAxis" style={{position: "absolute", left: buffer, width: timelineWidth}}/>
                {
                    // Draws all axis markings on the main axis, bookended by start and end markings
                    [...Array(25).keys()].map((i) => {
                        if (i == 0) return drawAxisMarking(i, startPos, 40, 3, showTimeLegend, true, false);
                        if (i == 24) return drawAxisMarking(i, endPos, 40, 3, showTimeLegend, false, true);
                        
                        return drawAxisMarking(i, i/24 * timelineWidth + buffer, i % 4 == 0? 10 : 5, i % 4 == 0? 2 : 1) 
                    })
                }
            </>
        );        
    }

    return (
        <div ref={ref} style={timelineStyle} onMouseDown={onMouseDown} onClick={onClick}>
            <div style={{width: width}}>
                    { renderAxis() }
                    { renderData() }
            </div>
        </div>
    )
};

Timeline.propTypes = {
    /** Dictionary that contains render data for Stays and Routes */
    render: PropTypes.object,
    /** Timeline height */
    height: PropTypes.number,
    /** If true, displays time below markings on the extremities */
    showTimeLegend: PropTypes.bool,
    /** If true, displays Stay name in the center of a Stay */
    showStayLegend: PropTypes.bool,
    /** Hex code for Timeline Stays color */
    color: PropTypes.string, 
    /** Behaviour when Timeline is clicked */
    onClick: PropTypes.func
}
  
export default Timeline;
