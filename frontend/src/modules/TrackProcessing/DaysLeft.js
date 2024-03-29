import React from 'react';
import moment from 'moment';
import AsyncButton from '../../components/Buttons/AsyncButton';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { changeDayToProcess, dismissDay, removeDay } from '../../actions/process';
import { toggleRemainingTracks } from '../../actions/process';
import { DONE_STAGE, PREVIEW_STAGE, POINTS_PER_KB } from '../../constants';
import { Tooltip } from '@mui/material';

const GPXStyle = { paddingLeft: '1rem', fontSize: '0.9rem' };
const GPXOfDay = ({ date, size }) => {
  size = size / 1000;
  date = moment(new Date(date));
  const pointsPredicted = Math.floor(size * POINTS_PER_KB);
  return (
    <div style={GPXStyle}>
      { date.format('LT') } • { Math.round(size) }kb • ~{ pointsPredicted } points
    </div>
  );
}

const EMPTY_FOLDER = (
  <div style={{ margin: 'auto', marginTop: '1rem', color: 'rgb(191, 191, 191)', textAlign: 'center' }}>
    <CheckIcon style={{ color: 'rgb(191, 191, 191)', verticalAlign: 'middle', marginRight: '5px' }} /> 
    <span style={{verticalAlign: 'middle'}}> Every day is processed </span>
  </div>
);

const buttonStyle = {
  float: 'right',
  textDecoration: 'none',
  fontSize: '0.65rem',
  marginLeft: '5px'
}

/**
 * Button for operations on day (deleting/skipping)
 * 
 * @param {string} className Adition CSS classes for button
 * @param {string} title Operation description
 * @param {HTMLElement} icon Icon in button
 * @param {function} onClick Behaviour when clicked
 */
const DayButton = ({className, title, icon, onClick}) => {
  return (
    <Tooltip title={title} placement='bottom'>
      <a className={className} style={buttonStyle} onClick={onClick}>
            {icon}
      </a>
    </Tooltip>
  )
}

/**
 * Button to select day to be processed
 * 
 * @param {string} date Day date
 * @param {Array} gpxs Array of gpxs files in input folder
 * @param {HTMLElement} isSelected Is day currently selected
 * @param {function} onDismiss Behaviour when day is dismissed
 * @param {function} onDelete Behaviour when day is deleted
 */
const Day = ({ date, gpxs, isSelected, onDismiss, onDelete }) => {
  const mDate = moment(date);
  return (
    <div className='clickable day-left' style={{ width: '345px', padding: '0.2rem', backgroundColor: isSelected ? '#666666' : '', color: isSelected ? 'white' : '', border: '1px #bbb solid', borderRadius: '5px', margin: '2px 0' }}>
      <DayButton className='button is-red is-white' title='Dismiss day. Does not delete track.' onClick={onDismiss} icon={<CloseIcon sx={{ fontSize: '0.85rem' }}/>}/>
      <DayButton className='button is-blue is-white' title='Delete track from input.' onClick={(e) => onDelete(e, gpxs)} icon={<DeleteIcon sx={{ fontSize: '0.85rem' }}/>}/>
      <Tooltip title='Click to change the day to process' placement='bottom'>
        <div>
          <div>
            <span>{ mDate.format('ll') }<span style={{ fontSize: '0.8rem', marginLeft: '5px', color: isSelected? 'white' : 'grey' }}>{ mDate.fromNow() }</span></span>
          </div>
          <div>
            {
              gpxs.map((gpx, key) => {
                return <GPXOfDay key={key} date={gpx.get('start')} size={gpx.get('size')} />
              }).toJS()
            }
          </div>
        </div>
      </Tooltip>
    </div>
  );
}

/**
 * Contains the logic and features for the Main View
 * 
 * @param {function} dispatch Redux store action dispatcher
 * @param {object} style Aditional CSS styling 
 * @param {string} selected Current day selected (YYYY-MM-DD format)
 * @param {boolean} hasChanges Whether changes have been made
 * @param {Array} lifesExistent LIFE files in input folder
 * @param {boolean} done If processing is complete
 */
let DaysLeft = ({ dispatch, style, remaining, selected, hasChanges, lifesExistent, done }) => {
  const remainingDays = remaining.map(([day, gpxs], i) => {
    const onDismiss = (e) => {
      e.preventDefault();
      dispatch(dismissDay(day));
    }

    const onDelete = (e, files) => {
      e.preventDefault();
      dispatch(removeDay(files.toJS()));
    }

    return (
      <AsyncButton  key={i} isDiv={true} withoutBtnClass={true} onClick={(e, modifier) => {
        if (selected !== day) {
          /*global confirm*/
          const go = !hasChanges || confirm('Do you wish to change days?\n\nAll changes made to the current day will be lost');
          if (go) {
            modifier('loaderr');
            dispatch(changeDayToProcess(day)).then(() => modifier());
            dispatch(toggleRemainingTracks());
          }
        }
      }}>
        <Day
          gpxs={gpxs} date={day}
          isSelected={selected === day} 
          onDismiss={onDismiss}
          onDelete={onDelete}
        />
      </AsyncButton>
    );
  });

  return (
    <div style={{...style, paddingBottom: '1rem'}}>
      <div style={{ fontSize: '1.5rem', textAlign: 'center' }}>{ done ? '' : 'Days Left' }</div>
      <div style={{overflowY: 'auto', maxHeight: '460px', minWidth: 'max-content'}}>
      {
        remaining.count() > 0 ? remainingDays : EMPTY_FOLDER
      }
      { 
        lifesExistent.length > 0 && 
          <div style={{marginTop: '2rem', textAlign: 'center'}}>LIFE Files</div> 
      }
      {
        lifesExistent.map((file) => {
          return (
            <div style={{ padding: '0.2rem', borderRadius: '3px', border: '1px #bbb dashed', opacity: 0.7 }}>
              <i>{ file }</i>
            </div>
          )
        })
      }
      </div>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    lifesExistent: state.get('process').get('LIFEQueue') || [],
    remaining: state.get('process').get('remainingTracks'),
    selected: state.get('process').get('daySelected'),
    hasChanges: state.get('tracks').get('history').get('past').count() !== 0 || state.get('process').get('step') !== PREVIEW_STAGE,
    done: state.get('process').get('step') === DONE_STAGE
  }
}

DaysLeft = connect(mapStateToProps)(DaysLeft);

DaysLeft.propTypes = {
  /** Redux store action dispatcher */
  dispatch: PropTypes.func,
  /** Aditional CSS styling  */
  style: PropTypes.object,
  /** Current day selected (YYYY-MM-DD format) */
  selected: PropTypes.string,
  /** Whether changes have been made */
  hasChanges: PropTypes.bool,
  /** LIFE files in input folder */
  lifesExistent: PropTypes.arrayOf(PropTypes.string),
  /** If processing is complete */
  done: PropTypes.bool
}

export default DaysLeft;