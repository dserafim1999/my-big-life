import React from 'react';

import { ANNOTATE_STAGE, DONE_STAGE } from '../../constants';

import TrackList from './TrackList';
import SemanticEditor from './SemanticEditor';
import DaysLeft from './DaysLeft';
import PropTypes from 'prop-types';

/**
 * Container for Track Processing menus
 *  
 * @param {boolean} showList Whether to show list of remaining days to process
 * @param {number} step Current processing step
 */
const PaneContent = ({ showList, step }) => {
  let content;
  let style = { overflowY: 'auto' };

  if (step === DONE_STAGE) {
    content = <DaysLeft style={{ flexGrow: 1, overflowY: 'auto' }}/>;
  } else if (showList) {
    content = <DaysLeft style={{ flexGrow: 1, overflowY: 'auto' }}/>;
  } else if (step === ANNOTATE_STAGE) {
    content = <SemanticEditor className='is-flexgrow' width='100%' />;
    style = {
      ...style,
      overflowX: 'visible',
      paddingTop: '2px',
      minWidth: '100%',
      borderRadius: '0px 3px 3px 0px',
      backgroundColor: 'white'
    };
  } else {
    content = <TrackList className='is-flexgrow' width='100%' />;
  }

  return (
    <div className='is-flexgrow expand' style={style} >
      {content}
    </div>
  );
}

PaneContent.propTypes = {
  /** Whether to show list of remaining days to process */
  showList: PropTypes.bool,
  /** Current processing step */
  step: PropTypes.number
}

export default PaneContent