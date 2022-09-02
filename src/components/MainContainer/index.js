import React from "react";
import LeafletMap from "../LeafletMap";
import AlertBox from "../AlertBox";
import { getRoute } from "../../modules/ModuleRoutes";


let MainContainer = ({ onKeyUp, onKeyDown, view }) => {
  return (
        <div id='container' onKeyUp={onKeyUp} onKeyDown={onKeyDown} > 
          <AlertBox/>
          <LeafletMap/>
        </div>
  );
};

export default MainContainer;