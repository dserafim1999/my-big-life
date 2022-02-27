import React from "react";

import LeafletMap from "../LeafletMap";

import SideBar from "../../components/SideBar";

import ConfigPane from '../ConfigPane';

import AlertBox from "../AlertBox";
import SidePane from "../SidePane";

let MainContainer = ({ keyHandler, downKeyHandler, showConfig, step }) => {


  return (
        <div id='container' onKeyUp={keyHandler} onKeyDown={downKeyHandler} > 
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