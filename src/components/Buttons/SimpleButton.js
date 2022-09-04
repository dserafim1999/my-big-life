import React from 'react';

import PropTypes from 'prop-types';

import { Tooltip } from '@mui/material';

/**
 * Simple button that performs an operation on click.
 * 
 * @constructor
 * @param {string} title Tooltip text
 * @param {object} style Aditional CSS styling for button
 * @param {function} onClick Behaviour when button is clicked
 * @param {boolean} isDiv If true, wraps content in a div
 * @param {string} tooltipPlacement Tooltip placement
 * @param {any} children Material Icon to use in button
 * @param {boolean} disabled Determines whether button is enabled or disabled 
 * @param {string} className Aditional CSS classes for button
 * @param {boolean} withoutBtnClass If true, 'button' Bulma CSS class is not used
 */

const SimpleButton = ({title, style, onClick, isDiv, tooltipPlacement, children, disabled, className, withoutBtnClass}) => {
    const _title = title !== undefined ? title : '';
  
    const createClassName = (additional, filter = () => (true)) => {
        return [withoutBtnClass ? null : 'button', disabled ? 'is-disabled' : null, className, additional]
            .filter(filter)
            .join(' ');
    }

    const classes = createClassName();
    
    if (isDiv) {
      return (
        <Tooltip title={_title} placement={tooltipPlacement !== undefined ? tooltipPlacement : 'top' } >  
          <div style={style} className={classes} onClick={onClick}>
            { children }
          </div>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={_title}  placement={tooltipPlacement !== undefined ? tooltipPlacement : 'top'} >  
          <a style={style} className={classes} onClick={onClick}>
            { children }
          </a>
        </Tooltip>
      );
    }
}

SimpleButton.propTypes = {
  /** Tooltip text */
  title: PropTypes.string,
  /** Aditional CSS styling for button */
  style: PropTypes.object,
  /** Behaviour when button is clicked */
  onClick: PropTypes.func,
  /** If true, wraps content in a div */
  isDiv: PropTypes.bool,
  /** Tooltip placement */
  tooltipPlacement: PropTypes.string,
  /** Material Icon to use in button */
  children: PropTypes.any,
  /** Determines whether button is enabled or disabled */
  disabled: PropTypes.bool,
  /** Aditional CSS classes for button */
  className: PropTypes.string,
  /** If true, 'button' Bulma CSS class is not used */
  withoutBtnClass: PropTypes.bool
}

export default SimpleButton;

