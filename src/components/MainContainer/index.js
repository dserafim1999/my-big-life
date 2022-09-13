import React from "react";

import PropTypes from 'prop-types';
import LeafletMap from "../LeafletMap";
import AlertBox from "../AlertBox";

/**
 * Container that holds the main components that persist throughout the different modules. More speciffically, the map and alerts.
 * 
 * @constructor
 * @param {function} onKeyUp Up key handler
 * @param {function} onKeyDown Down key handler
 */
const MainContainer = ({ onKeyUp, onKeyDown }) => {
  return (
        <div id='container' onKeyUp={onKeyUp} onKeyDown={onKeyDown} > 
          <AlertBox/>
          <LeafletMap/>
        </div>
  );
};

MainContainer.propTypes = {
  /** Up key handler */
  onKeyUp: PropTypes.func,
  /** Down key handler */
  onKeyDown: PropTypes.func
}

export default MainContainer;