import React from 'react';
import { Tooltip } from '@mui/material';

const IconButton = ({ tooltipPlacement, children, onClick }) => {
  
  return (
        <a className={'icon-button button'} onClick={onClick}>    
            <Tooltip title={'Toggle Segment Visibility'}  placement={tooltipPlacement} arrow>  
                { children }
            </Tooltip>
        </a>    
  );
}

export default IconButton;

