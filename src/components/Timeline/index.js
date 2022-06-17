import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { useDimensions, normalize } from "../../utils";
import { MINUTES_IN_DAY } from "../../constants";

const Timeline = ({ data, showTimeLegend }) => {
    const [zoomLevel, setZoomLevel] = useState(1); 
    const ref = useRef(null);
    const { width, height } = useDimensions(ref);
    const minZoom = 1, maxZoom = 2.5;
    
    const buffer = 30;
    const timelineWidth = (width-2*buffer) * zoomLevel;
    const startPos = buffer;
    const endPos = timelineWidth+buffer;

    useEffect(() => {
        const onScroll = (e) => {
            if (e.ctrlKey) {
                e.preventDefault();
            }
            limitZoomLevel(zoomLevel - (e.deltaY/Math.abs(e.deltaY)) * 0.05);
        };
        
        window.removeEventListener('wheel', onScroll);
        window.addEventListener('wheel', onScroll, { passive: false });
        return () => window.removeEventListener('wheel', onScroll);
    });

    const limitZoomLevel = (zoom) => {
        if (zoom >= minZoom && zoom <= maxZoom) {
            setZoomLevel(zoom);
        }
    }

    var timelineStyle = {
        width: "100%", 
        height: "100px", 
        position: "relative",
        overflowX: "scroll",
    } 

    
    const stayStyle = (start, spanWidth, opacity) => {
        return {
            position:"absolute",
            left: start, 
            backgroundColor: "#821d1d", 
            width: spanWidth, 
            height: "50px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: opacity,
        }
    }
    
    const routeStyle = (start, spanWidth, opacity) => {
        return {
            position:"absolute",
            left: start, 
            backgroundColor: "grey", 
            width: spanWidth, 
            height: "5px",
            top: "50%",
            transform: "translateY(-50%)",
            opacity: opacity,
        }
    }

    const drawAxisMarking = (pos, height, width, isStart=false, isEnd=false) => {
        const isLimit = isStart || isEnd; 
        const markingStyle = {
            borderLeft: width+"px solid "+ (isLimit ? "grey" : "lightgrey"),
            height: height+"px",
            position: "absolute",
            left: pos+"px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "0px"
        }

        return (
            <div style={markingStyle}>
                {
                    isLimit && showTimeLegend &&
                    <span style={{fontSize: '10px',position: 'relative',top: '80%',right: '60%'}}> 
                        {isStart? "00:00" : "23:59"}
                    </span>
                }
            </div>
        );
    }

    const getMaxFreq = (array) => {
        return Math.max(...array.map(o => o.freq));
    } 

    const getOpacityValue = (value, maxValue) => {
        return value/maxValue;
    }
    
    const getMinutes = (date) => {
        return moment(date).hours() * 60 + moment(date).minutes();
    } 

    const getTimelineCoords = (time) => {
        const minutes = getMinutes(time);
        return normalize(minutes, 0, MINUTES_IN_DAY - 1, startPos, endPos);
    }

    const draw = (type, style) => {
        if (type === undefined) return;
        const maxFreq = getMaxFreq(data.stays);
        
        return (
            <div className={type} style={{position: "absolute", display: "flex", height: "100%"}}>
                {
                    type.flatMap((span) => {
                        const start = getTimelineCoords(span.start);
                        const end = getTimelineCoords(span.end);

                        if (start < startPos || end > endPos) return [];

                        const spanWidth = end - start;
                        const opacity = getOpacityValue(span.freq, maxFreq);
            
                        return [<div style={style(start, spanWidth, opacity)}></div>];
                    })
                }
            </div>
        );
    }

    const renderData = () => {
        return (
            <div className="dataContainer">
                { draw(data.stays, stayStyle) }
                { draw(data.routes, routeStyle) }
            </div>
        )
    }

    const renderAxis = () => {
        return (
            <>
                <hr className="horizontalAxis" style={{position: "absolute", left: buffer, width: timelineWidth}}/>
                {
                    [...Array(25).keys()].map((i) => {
                        if (i == 0) return drawAxisMarking(startPos, 50, 3, true, false);
                        if (i == 24) return drawAxisMarking(endPos, 50, 3, false, true);
                        
                        return drawAxisMarking(i/24 * timelineWidth + buffer, i % 4 == 0? 10 : 5, i % 4 == 0? 2 : 1) 
                    })
                }
            </>
        );        
    }

    return (
        <div ref={ref} style={timelineStyle}>
            <div style={{width: width}}>
                    { renderAxis() }
                    { renderData() }
            </div>
        </div>
    )
};
  
export default Timeline;
