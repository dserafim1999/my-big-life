import React from "react";
import moment from "moment";
import useMeasure from 'react-use-measure';
import { MINUTES_IN_DAY } from "../../constants";
import { normalize } from "../../utils";


const Timeline = ({ data }) => {
    const [ref, bounds] = useMeasure();
    const fullWidth = bounds.width;
    const widthBuffer = 20; // pxs on each side 
    const axisWidth = fullWidth - 2 * widthBuffer;

    const timelineStyle = {
        borderLeft: "1px solid grey",
        width: "100%", 
        height: "100px", 
        position: "relative"
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

    const drawAxisMarking = (pos, height, width, isEnd = false) => {
        const markingStyle = {
            borderLeft: width+"px solid "+ (isEnd ? "grey" : "lightgrey"),
            height: height+"px",
            position: "absolute",
            left: pos+"px",
            top: "50%",
            transform: "translateY(-50%)",
            padding: "0px"
        }

        return <div style={markingStyle}/>
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
        return normalize(minutes, 0, MINUTES_IN_DAY, widthBuffer, fullWidth - widthBuffer);
    }

    const draw = (type, style) => {
        if (type === undefined) return;
        const maxFreq = getMaxFreq(data.stays);
        
        return (
            <div className={type} style={{position: "absolute", display: "flex", height: "100%"}}>
                {
                    type.map((span) => {
                        const start = getTimelineCoords(span.start);
                        const end = getTimelineCoords(span.end);
                        const spanWidth = end - start;
                        const opacity = getOpacityValue(span.freq, maxFreq);
            
                        return <div style={style(start, spanWidth, opacity)}></div>
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
                <hr className="horizontalAxis" style={{width: axisWidth}}/>
                {
                    [...Array(25).keys()].map((i) => {
                        if (i == 0) return drawAxisMarking(widthBuffer, 50, 3, true);
                        if (i == 24) return drawAxisMarking(fullWidth - widthBuffer, 50, 3, true);
                        
                        return drawAxisMarking(i/24 * axisWidth + widthBuffer, i % 4 == 0? 10 : 5, i % 4 == 0? 2 : 1) 
                    })
                }
            </>
        );        
    }

    return (
        <div ref={ref} style={timelineStyle}>
            { renderAxis() }
            { renderData() }
        </div>
    )
};
  
export default Timeline;
