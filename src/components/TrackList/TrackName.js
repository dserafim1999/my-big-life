import React from 'react';

import moment from 'moment';
import IconButton from '../../components/Buttons/IconButton';
import PropTypes from 'prop-types';

import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { TrackRecord } from '../../records';

const dateFormatter = (name) => {
  return moment(name.slice(0, -4)).format('ddd, MMM Do YYYY');
}

/**
 * Container that contains Track date and global Track operations
 * 
 * @constructor
 * @param {TrackRecord} track Track to be represented
 * @param {function} onDownload Behaviour when Download button is clicked
 * @param {function} onShowAll Behaviour when Show All button is clicked
 * @param {function} onHideAll Behaviour when Hide All button is clicked 
 */
const TrackName = ({ track, onDownload, onShowAll, onHideAll}) => {
  
  var name = track.get('name') ? dateFormatter(track.get('name')) : 'Untitled.gpx';
  
  const downloadButton = (
    <IconButton
      className={'float-right is-blue'}
      onClick={onDownload}
      title='Download Track'>
        <DownloadIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
    </IconButton>
  );

  const showAllButton = (
    <IconButton
      className={'float-right'}
      onClick={onShowAll}
      title='Show All Track Segments'>
        <VisibilityIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
    </IconButton>
  );

  const hideAllButton = (
    <IconButton
      className={'float-right'}
      onClick={onHideAll}
      title='Hide All Track Segments'>
        <VisibilityOffIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
    </IconButton>
  );
    
  return (
      <div>
        { downloadButton }
        { showAllButton }
        { hideAllButton }
        <a style={{ color: '#666', display: 'flex', alignItems: 'flex-start' }}>
            <span>{name}</span>
        </a>
      </div>
  );
}

TrackName.propTypes = {
  /** Track to be represented */
  track: PropTypes.instanceOf(TrackRecord),
  /** Behaviour when Download button is clicked */
  onDownload: PropTypes.func,
  /** Behaviour when Show All button is clicked */
  onShowAll: PropTypes.func,
  /** Behaviour when Hide All button is clicked */
  onHideAll: PropTypes.func
}

export default TrackName;
