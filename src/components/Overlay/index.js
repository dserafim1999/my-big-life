import React from 'react';

import PropTypes from 'prop-types';

const overlayStyle = {
  position: 'fixed',
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(128, 128, 128, 0.75)',
  zIndex: '1000'
}

/**
 * Container that displays content over the main application.
 * 
 * @constructor
 * @param {any} children Content to be displayed above the application.
 */
const Overlay = ({ children, ...props }) => {
  return (
    <div style={overlayStyle} {...props}>
      { children }
    </div>
  );
}

Overlay.propTypes = {
  /** Content to be displayed above the application */
  children: PropTypes.any 
}

export default Overlay;
