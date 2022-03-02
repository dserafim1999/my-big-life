import React from "react";

import LeafletMap from "../LeafletMap";

import AlertBox from "../AlertBox";
import SidePane from "../TrackProcessing";

let MainContainer = ({ onKeyUp, onKeyDown, step }) => {
  return (
        <div id='container' onKeyUp={onKeyUp} onKeyDown={onKeyDown} > 
          <AlertBox/>
          {/*<SidePane/>*/}
          <LeafletMap/>
        </div>
  );
};

export default MainContainer;