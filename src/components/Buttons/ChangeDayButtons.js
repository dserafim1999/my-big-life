import React from 'react';
import AsyncButton from './AsyncButton';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import RefreshIcon from '@mui/icons-material/Refresh';

const ChangeDayButtons = ({ onBack, onRefresh, isEmpty, isLoadingQueue, dispatch }) => {
  const refreshClassName = 'is-blue' + (isLoadingQueue ? ' is-loading' : '');

  const back = isEmpty ? null :
    (
      <AsyncButton 
        title='Go Back To Edit Day' 
        className={'is-blue'} 
        onClick={onBack}>
          <ChevronLeftIcon/>
          Back
      </AsyncButton>
    );

  const refresh = (
    <AsyncButton 
      title='Refresh Input Folder' 
      className={refreshClassName} 
      onClick={onRefresh}>
        Refresh
        <RefreshIcon style={{marginLeft: '10px'}}/>
    </AsyncButton>
  );

  

  return (
    <div style={{display: 'flex', justifyContent: isEmpty ? 'center' : 'space-between'}}>
      { back }
      { refresh }
    </div>
  );
}

export default ChangeDayButtons;