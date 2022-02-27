import React from 'react';
import AsyncButton from '../AsyncButton';

import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';
import SkipIcon from '@mui/icons-material/SkipNext';

const buttonStyle = {
  flex: 1,
  flexGrow: 1
}

const NavigationButtons = ({ canPrevious, onPrevious, canSkip, onSkip, onNext, canProceed }) => {
  const previous = (
    <AsyncButton style={buttonStyle} disabled={!canPrevious} className={'is-warning'} onClick={onPrevious}>
        <LeftIcon/>
        Previous
    </AsyncButton>
  );

  const skip = (
    <AsyncButton style={buttonStyle} disabled={!canSkip} className={'is-warning'} onClick={onSkip}>
        Skip Day
        <SkipIcon/>
    </AsyncButton>
  );

  const next = (
    <AsyncButton style={buttonStyle} disabled={!canProceed} className={'is-success'} onClick={onNext}>
        Continue
        <RightIcon/>
    </AsyncButton>
  );
 
  return (
    <>
      <div className='column is-half is-gapless has-text-centered'>
          { canPrevious ? previous : skip }
      </div>
      <div className='column is-half is-gapless has-text-centered'>
          { next }
      </div>
    </>
  );
}

export default NavigationButtons;