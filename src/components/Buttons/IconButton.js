import React from 'react';

import PropType from 'prop-types';

import { Tooltip } from '@mui/material';

/**
 * Bordered button that houses material icons.
 * 
 * @constructor
 * @param {any} children Material Icon to use in button 
 * @param {string} className Aditional CSS classes for button
 * @param {object} style Aditional CSS styling
 * @param {function} onClick Behaviour when button is clicked
 * @param {string} title Tooltip text
 * @param {string} tooltipPlacement Tooltip placement
 */

const IconButton = ({ tooltipPlacement, title, className = '', style, children, onClick }) => {
  return (
        <a className={'icon-button button '+ className} onClick={onClick} style={style}>    
            <Tooltip title={title} placement={tooltipPlacement !== undefined ? tooltipPlacement : 'bottom'}>  
                { children }
            </Tooltip>
        </a>    
  );
}

IconButton.propTypes = {
  /** Material Icon to use in button */
  children: PropType.any,
  /** Aditional CSS classes for button */
  className: PropType.string,
  /** Aditional CSS styling */
  style: PropType.object,
  /** Behaviour when button is clicked */
  onClick: PropType.func,
  /** Tooltip text */
  title: PropType.string,
  /** Tooltip placement */
  tooltipPlacement: PropType.string
}

export default IconButton;

