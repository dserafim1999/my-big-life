import React from 'react';
import AsyncButton from './AsyncButton';

import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';
import SkipIcon from '@mui/icons-material/SkipNext';
import SaveIcon from '@mui/icons-material/Check';

const buttonStyle = {
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  marginLeft: '0.25rem',
  marginRight: '0.25rem',
}

const NavigationButtons = ({ isLoadingPrevious, isLoadingNext, canPrevious, onPrevious, canSkip, onSkip, onNext, canProceed, isFinal, onChangeDay, daysLeft }) => {
  const prevClassName = 'is-blue' + (isLoadingPrevious ? ' is-loading' : '');
  const nextClassName = 'is-blue' + (isLoadingNext ? ' is-loading' : '');

  const previous = canPrevious ? (
    <AsyncButton title='Previous Step' style={buttonStyle} disabled={isLoadingPrevious} className={prevClassName} onClick={onPrevious}>
        <LeftIcon/>
        Previous
    </AsyncButton>
  ) : null;

  const skip = canSkip ? (
    <AsyncButton title='Skip day being processed' style={buttonStyle} disabled={isLoadingPrevious} className={prevClassName} onClick={onSkip}>
        Skip Day
        <SkipIcon/>
    </AsyncButton>
  ) : null;

  const next = canProceed ? (
    <AsyncButton title='Continue to next Step' style={buttonStyle} disabled={isLoadingNext} className={nextClassName} onClick={onNext}>
        Continue
        <RightIcon/>
    </AsyncButton>
  ) : null;

  const changeDay = (
    <AsyncButton title='Change Day To Process' style={buttonStyle} className={'is-light'} disabled={isLoadingNext} onClick={onChangeDay}>
        <span style={{ cursor: 'pointer' }}>
            <div>Change Day</div>
            <div style={{fontSize: '0.7rem', fontWeight: 'bold'}}>({daysLeft} day{daysLeft > 1 ? 's' : ''} remaining)</div>
        </span>
    </AsyncButton>
  );

  const save = canProceed ? (
    <AsyncButton title='Save day to server' style={buttonStyle} disabled={isLoadingNext} className={nextClassName} onClick={onNext}>
        Save
        <SaveIcon/>
    </AsyncButton>
  ): null;
 
  return (
    <>
      { canPrevious ? previous : skip }
      { changeDay }      
      { isFinal ? save : next }
    </>
  );
}

export default NavigationButtons;