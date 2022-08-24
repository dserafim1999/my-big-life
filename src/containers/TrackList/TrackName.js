import React from 'react';
import moment from 'moment';

import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import IconButton from '../../components/Buttons/IconButton';

const dateFormatter = (name) => {
  return moment(name.slice(0, -4)).format('ddd, MMM Do YYYY');
}

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

export default TrackName;
