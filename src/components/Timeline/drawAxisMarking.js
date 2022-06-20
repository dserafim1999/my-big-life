import React from "react";

export const drawAxisMarking = (index, pos, height, width, showTimeLegend, isStart=false, isEnd=false) => {
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