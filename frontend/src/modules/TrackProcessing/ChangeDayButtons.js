import React from 'react';

import AsyncButton from '../../components/Buttons/AsyncButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import RefreshIcon from '@mui/icons-material/Refresh';
import PropTypes from 'prop-types';

/**
 * Buttons used to navigate the Change Day menu in the Track Processing Module
 * 
 * @constructor
 * @param {function} onBack Behaviour when returning to Track Processing
 * @param {function} onRefresh Behaviour when Track List is refreshed
 * @param {boolean} isEmpty If Track List is empty
 * @param {boolean} isLoadingQueue If Track Queue is loading
 */
const ChangeDayButtons = ({ onBack, onRefresh, isEmpty, isLoadingQueue }) => {
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

ChangeDayButtons.propTypes = {
  /** Behaviour when returning to Track Processing */
  onBack: PropTypes.func,
  /** Behaviour when Track List is refreshed */
  onRefresh: PropTypes.func,
  /** If Track List is empty */
  isEmpty: PropTypes.bool,
  /** If Track Queue is loading */
  isLoadingQueue: PropTypes.bool
}

export default ChangeDayButtons;