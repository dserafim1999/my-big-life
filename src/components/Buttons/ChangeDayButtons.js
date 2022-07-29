import React from 'react';
import AsyncButton from './AsyncButton';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import RefreshIcon from '@mui/icons-material/Refresh';

const buttonStyle = {
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  marginLeft: '0.25rem',
  marginRight: '0.25rem',
}

const ChangeDayButtons = ({ onBack, onRefresh, isEmpty, isLoadingQueue, dispatch }) => {
  const refreshClassName = 'is-blue' + (isLoadingQueue ? ' is-loading' : '');

  const back = isEmpty ? null :
    (
      <AsyncButton 
        title='Go Back To Edit Day' 
        style={buttonStyle} 
        className={'is-blue'} 
        onClick={onBack}>
          <ChevronLeftIcon/>
          Back
      </AsyncButton>
    );

  const refresh = (
    <AsyncButton 
      title='Refresh Input Folder' 
      style={buttonStyle} 
      className={refreshClassName} 
      onClick={onRefresh}>
        Refresh
        <RefreshIcon/>
    </AsyncButton>
  );

  

  return (
    <>
      { back }
      { refresh }
    </>
  );
}

export default ChangeDayButtons;