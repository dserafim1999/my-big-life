import { Tooltip } from "@mui/material";
import React from "react";


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

const Stay = ({ start, width, opacity, legend }) => {
    const stayStyle =  {
        position:"absolute",
        left: start, 
        backgroundColor: "#821d1d", 
        width: width, 
        height: "50px",
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
  
export default Stay;
