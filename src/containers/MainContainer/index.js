import React from "react";

import LeafletMap from "../LeafletMap";

import AlertBox from "../AlertBox";

let MainContainer = ({ onKeyUp, onKeyDown }) => {
  return (
        <div id='container' onKeyUp={onKeyUp} onKeyDown={onKeyDown} > 
          <AlertBox/>
          <LeafletMap/>
        </div>
  );
};

export default MainContainer;