import React from "react";

const Stay = ({ start, width, opacity }) => {
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

    return (
        <div style={stayStyle}></div>
    );
}
  
export default Stay;
