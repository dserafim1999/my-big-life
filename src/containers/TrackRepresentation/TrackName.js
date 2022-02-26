import React from 'react';
import { connect } from 'react-redux';
import {
  downloadTrack,
  toggleTrackRenaming,
  updateTrackName
} from '../../actions/tracks';

import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip } from '@mui/material';

const TrackName = ({ dispatch, trackId, renaming, name }) => {
  const updateName = (e) => {
    if (e.type) {
      const val = e.target.value;
      dispatch(updateTrackName(trackId, val));
    }
  }
  const toggleEditing = () => dispatch(toggleTrackRenaming(trackId));
  const onDownload = () => dispatch(downloadTrack(trackId));

  if (renaming) {
    return (
      <div className='control is-grouped has-addons'>
        <input className='input' type='text' value={name} onChange={updateName} />
        <a className='button is-info' onClick={toggleEditing}>
          <CheckIcon />
        </a>
      </div>
    )
  } else {
    let downloadButton = (
      <a className='float-right button icon-button column is-gapless is-text-centered' onClick={onDownload}>    
            <Tooltip title={'Download Track'}  placement="top" arrow>  
                <DownloadIcon/>
            </Tooltip>
      </a>
    );
      
    return (
      <div>
        { downloadButton }
        <a onClick={toggleEditing} style={{ color: '#666' }}>{name}</a>
      </div>
    );
  }
}

const mapStateToProps = (state, { trackId }) => {
  const { name, renaming } = state.get('tracks').get('tracks').get(trackId);
  return {
    name,
    trackId,
    renaming
  }
}

export default connect(mapStateToProps)(TrackName);
