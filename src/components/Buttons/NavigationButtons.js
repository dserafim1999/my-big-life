import React from 'react';
import AsyncButton from '../AsyncButton';

import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';

const NavigationButtons = ({ onPrevious, onNext, stage, canProceed }) => {
  return (
    <>
      <div className='column is-half is-gapless has-text-centered'>
          <AsyncButton disabled={stage === 0} className={'is-warning'} onClick={onPrevious}>
            <LeftIcon/>
            Previous
          </AsyncButton>
      </div>
      <div className='column is-half is-gapless has-text-centered'>
          <AsyncButton disabled={!canProceed} className={'is-success'} onClick={onNext}>
            Continue
            <RightIcon/>
          </AsyncButton>
      </div>
    </>
  );
}

export default NavigationButtons;