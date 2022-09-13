import React from 'react';

import PropTypes from 'prop-types';

const blockStyle = {
  marginTop: '10px'
}
const blockHeader = {
  fontSize: '1.4rem'
}

/**
 * Container that holds a section of Form Fields
 * 
 * @constructor
 * @param {string} name Section name
 * @param {any} children Form Fields
 * @param {HTMLElement} button
 */
const SectionBlock = ({ name, children, button }) => {
  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <h3 style={blockHeader}> {name} </h3>
        {button}
      </div>
      <div style={blockStyle}>
        {children}
      </div>
    </div>
  );
}

SectionBlock.propTypes = {
  /** Section name */
  name: PropTypes.string,
  /** Form Fields */
  children: PropTypes.any,
  button: PropTypes.instanceOf(HTMLElement) 
}

export default SectionBlock;