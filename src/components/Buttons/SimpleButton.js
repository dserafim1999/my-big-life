import { Tooltip } from '@mui/material';
import React from 'react';

const SimpleButton = ({title, style, onClick, isDiv, tooltipPlacement, content, children, disabled, className, withoutBtnClass}) => {
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
            { content || children }
          </div>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={_title}  placement={tooltipPlacement !== undefined ? tooltipPlacement : 'top'} >  
          <a style={style} className={classes} onClick={onClick}>
            { content || children }
          </a>
        </Tooltip>
      );
    }
}

export default SimpleButton;

