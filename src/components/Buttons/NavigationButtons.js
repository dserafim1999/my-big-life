import React from 'react';
import AsyncButton from '../AsyncButton';

import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';
import SkipIcon from '@mui/icons-material/SkipNext';
import SaveIcon from '@mui/icons-material/Check';

const buttonStyle = {
  flex: 1,
  flexGrow: 1
}

const NavigationButtons = ({ isLoadingPrevious, isLoadingNext, canPrevious, onPrevious, canSkip, onSkip, onNext, canProceed, isFinal }) => {
  const prevClassName = 'is-warning' + (isLoadingPrevious ? ' is-loading' : '');
  const nextClassName = 'is-success' + (isLoadingNext ? ' is-loading' : '');

  const previous = (
    <AsyncButton style={buttonStyle} disabled={!canPrevious || isLoadingPrevious} className={prevClassName} onClick={onPrevious}>
        <LeftIcon/>
        Previous
    </AsyncButton>
  );

  const skip = (
    <AsyncButton style={buttonStyle} disabled={!canSkip || isLoadingPrevious} className={prevClassName} onClick={onSkip}>
        Skip Day
        <SkipIcon/>
    </AsyncButton>
  );

  const next = (
    <AsyncButton style={buttonStyle} disabled={!canProceed || isLoadingNext} className={nextClassName} onClick={onNext}>
        Continue
        <RightIcon/>
    </AsyncButton>
  );

  const save = (
    <AsyncButton style={buttonStyle} disabled={!canProceed || isLoadingNext} className={nextClassName} onClick={onNext}>
        Save
        <SaveIcon/>
    </AsyncButton>
  )
 
  return (
    <>
      <div className='column is-half is-gapless has-text-centered'>
          { canPrevious ? previous : skip }
      </div>
      <div className='column is-half is-gapless has-text-centered'>
          { isFinal ? save : next }
      </div>
    </>
  );
}

export default NavigationButtons;