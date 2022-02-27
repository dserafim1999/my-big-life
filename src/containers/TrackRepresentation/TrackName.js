import React, { Component } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import DownloadIcon from '@mui/icons-material/Download';
import { Tooltip } from '@mui/material';

export default class TrackName extends Component {
  constructor (props) {
    super(props);
    this.state = {
      renaming: false,
      name: props.track.get('name') || 'Untitled.gpx'
    }
  }

  updateName (e) {
    this.state.name = e.target.value;
    this.setState(this.state);
  }

  toggleEditing () {
    if (this.state.renaming) {
      this.props.onRename(this.state.name);
    }
    
    this.state.renaming = !this.state.renaming;
    this.setState(this.state);
  }

  render () {
    const { renaming, name } = this.state;
    const { onDownload } = this.props;
    const toggleEditing = this.toggleEditing.bind(this);
    let downloadButton = null;

    if (renaming) {
      return (
        <div className='control is-grouped has-addons'>
          <input className='input' type='text' value={name} onChange={this.updateName.bind(this)} />
          <a className='button is-info' onClick={toggleEditing}>
            <CheckIcon/>
          </a>
        </div>
      );
    } else {
        downloadButton = (
          <a className='float-right clickable icon' onClick={onDownload}>
            <Tooltip title={'Download Track'}  placement="top" arrow>  
              <DownloadIcon />
            </Tooltip>
          </a>
        );
    }
  
    return (
      <div>
        { downloadButton }
        <a onClick={toggleEditing} style={{ color: '#666' }}>{name}</a>
      </div>
    );
  }
}
