import React from "react";

import LeafletMap from "../LeafletMap";

import ConfigPane from '../ConfigPane';

import AlertBox from "../AlertBox";
import SidePane from "../TrackProcessing";

let MainContainer = ({ onKeyUp, onKeyDown, showConfig, step }) => {
  return (
        <div id='container' onKeyUp={onKeyUp} onKeyDown={onKeyDown} > 
          <AlertBox/>
          {/*<SidePane/>*/}
          <LeafletMap/>
          { showConfig ? <ConfigPane /> : null }
        </div>
  );
};

export default MainContainer;