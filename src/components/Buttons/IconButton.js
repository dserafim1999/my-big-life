import React from 'react';
import { Tooltip } from '@mui/material';

const IconButton = ({ tooltipPlacement, title, className = '', children, onClick }) => {
  
  return (
        <a className={'icon-button button '+ className} onClick={onClick}>    
            <Tooltip title={title} placement={tooltipPlacement !== undefined ? tooltipPlacement : 'bottom'}>  
                { children }
            </Tooltip>
        </a>    
  );
}

export default IconButton;

