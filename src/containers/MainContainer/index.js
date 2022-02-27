import React from "react";

import LeafletMap from "../LeafletMap";

import SideBar from "../../components/SideBar";

import ConfigPane from '../ConfigPane';

import AlertBox from "../AlertBox";
import SidePane from "../SidePane";

let MainContainer = ({ onKeyUp, onKeyDown, showConfig, step }) => {
  return (
        <div id='container' onKeyUp={onKeyUp} onKeyDown={onKeyDown} > 
          <AlertBox/>
          {
          //<SideBar/>}
          }
          <SidePane/>
          <LeafletMap/>
          { showConfig ? <ConfigPane /> : null }
        </div>
  );
};

export default MainContainer;