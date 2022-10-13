import React from 'react';

import AsyncButton from '../../components/Buttons/AsyncButton';
import LeftIcon from '@mui/icons-material/ChevronLeft';
import RightIcon from '@mui/icons-material/ChevronRight';
import SkipIcon from '@mui/icons-material/SkipNext';
import SaveIcon from '@mui/icons-material/Save';
import PropTypes from 'prop-types';

const buttonStyle = {
  paddingLeft: '0.5rem',
  paddingRight: '0.5rem',
  marginLeft: '0.25rem',
  marginRight: '0.25rem',
}

/**
 * @param {boolean} isLoadingPrevious Whether previous step is being loaded
 * @param {boolean} isLoadingNext Whether next step is being loaded 
 * @param {boolean} canPrevious Whether you can go back to the previous step
 * @param {function} onPrevious Behaviour when going back to the previous step
 * @param {boolean} canSkip Whether you can skip a day in processing
 * @param {function} onSkip Behaviour when day is skipped
 * @param {function} onNext Behaviour when advancing to the next step
 * @param {boolean} canProceed Whether you can advance to the next step
 * @param {boolean} isFinal Is final processing step
 * @param {function} onChangeDay Behaviour when clicking on the change day button
 * @param {number} daysLeft Number of days left to process in input folder
 */
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
        <SaveIcon style={{marginLeft: '10px'}}/>
    </AsyncButton>
  ): null;
 
  return (
    <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
      { canPrevious ? previous : skip }
      { changeDay }      
      { isFinal ? save : next }
    </div>
  );
}

NavigationButtons.propTypes = {
  /** Whether previous step is being loaded */
  isLoadingPrevious: PropTypes.bool, 
  /** Whether next step is being loaded  */
  isLoadingNext: PropTypes.bool, 
  /** Whether you can go back to the previous step */
  canPrevious: PropTypes.bool, 
  /** Behaviour when going back to the previous step */
  onPrevious: PropTypes.func, 
  /** Whether you can skip a day in processing */
  canSkip: PropTypes.bool, 
  /** Behaviour when day is skipped */
  onSkip: PropTypes.func, 
  /** Behaviour when advancing to the next step */
  onNext: PropTypes.func, 
  /** Whether you can advance to the next step */
  canProceed: PropTypes.bool, 
  /** Is final processing step */
  isFinal: PropTypes.bool, 
  /** Behaviour when clicking on the change day button */
  onChangeDay: PropTypes.func, 
  /** Number of days left to process in input folder */
  daysLeft: PropTypes.number, 
}

export default NavigationButtons;