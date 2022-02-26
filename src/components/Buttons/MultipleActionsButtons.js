import React from 'react';
import { ANNOTATE_STAGE } from '../../constants';

import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from '@mui/material';

let OptionButton = ({children, description, onClick}) => {
    return (
        <a className='button icon-button column is-gapless is-text-centered' onClick={onClick}>    
            <Tooltip title={description}  placement="top" arrow>  
                { children }
            </Tooltip>
        </a>
    );
}

const MultipleActionsButtons = ({ onShowHide, onDownload, onClear, segmentsCount, stage }) => {
  if (segmentsCount > 1 && stage !== ANNOTATE_STAGE) {
    return (
      <div className='columns fade-in' style={{padding: '0px 50px 0px 50px'}}>
        <OptionButton onClick={onShowHide} description='Toggle all'>
            <VisibilityIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
        </OptionButton>
        <OptionButton onClick={onDownload} description='Download all'>
            <DownloadIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
        </OptionButton>
        <OptionButton onClick={onClear} description='Delete all'>
            <DeleteIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
        </OptionButton>
      </div>
    );
  } else {
    return <span></span>;
  }
}

export default MultipleActionsButtons;