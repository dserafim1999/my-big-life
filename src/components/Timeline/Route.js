import React from "react";

const Route = ({ start, width, opacity }) => {
    const routeStyle =  {
        position:"absolute",
        left: start, 
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
  
export default Route;
