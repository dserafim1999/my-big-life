import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { normalize, clamp } from "../../utils";
import useDimensions from "../../utils/useDimensions";
import { MINUTES_IN_DAY } from "../../constants";
import useDraggableScroll from "use-draggable-scroll";
import Stay from "./Stay";
import Route from "./Route";
import { drawAxisMarking } from './drawAxisMarking';

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
                        const start = getTimelineCoords(span.start);
                        const end = getTimelineCoords(span.end);
                        
                        if (start < startPos || end > endPos) return [];
                        
                        const spanWidth = end - start;
                        const opacity = getOpacityValue(span.freq, maxFreq);

                        return block === "stay" ? 
                            [<Stay key={i} start={start} width={spanWidth} opacity={opacity} legend={showStayLegend ? span.location : ""} color={color}/>] : 
                            [<Route key={i} start={start} width={spanWidth} opacity={opacity}/>];
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
  
export default Timeline;
