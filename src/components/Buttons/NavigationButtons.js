import React from 'react';
import AsyncButton from './AsyncButton';

import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';
import SkipIcon from '@mui/icons-material/SkipNext';
import SaveIcon from '@mui/icons-material/Check';

const buttonStyle = {
  flex: 1,
  flexGrow: 1
}

const NavigationButtons = ({ isLoadingPrevious, isLoadingNext, canPrevious, onPrevious, canSkip, onSkip, onNext, canProceed, isFinal, onChangeDay }) => {
  const prevClassName = 'is-warning' + (isLoadingPrevious ? ' is-loading' : '');
  const nextClassName = 'is-success' + (isLoadingNext ? ' is-loading' : '');

  console.log("canProceed: " + canProceed)

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
    <AsyncButton title='Change Day To Process' style={buttonStyle} disabled={isLoadingNext} onClick={onChangeDay}>
        Change Day
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