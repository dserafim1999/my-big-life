import React from "react";
import { connect } from 'react-redux';

import Track from './Track';

import {
  downloadTrack,
  updateTrackName
} from '../../actions/tracks';

const LOADING = <span className='button is-large is-loading' style={{ border: 0 }}>Loading</span>;

const EMPTY_FOLDER = (
  <div style={{ width: '70%' }}>
    There are no more files in the input folder
  </div>
);

const style = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  width: '100%'
}

let TrackList = ({ dispatch, tracks, className, step }) => {
    if (tracks.count() !== 0) {
        return (
            <ul style={{padding: 0}}>
                {
                  tracks.map((track, i) => {
                    const trackId = track.get('id');
                    const updateName = (newName) => dispatch(updateTrackName(trackId, newName));
                    const onDownload = () => dispatch(downloadTrack(trackId));
                    return <Track trackId={trackId} key={i} onRename={updateName} onDownload={onDownload} />;
                  })
                }
            </ul>
        )
    } else {
      return (
        <div style={style}>
          { step === -2 ? LOADING : EMPTY_FOLDER }
        </div>
      );
    }
} 

const mapStateToProps = (state) => {
  const findStart = (track) => {
    return track
      .get('segments').toList().map((segmentId) => {
        return state.get('tracks').get('segments').get(segmentId);
      })
      .sort((a, b) => {
        return a.getStartTime().diff(b.getStartTime());
      })
      .get(0);
  }

  const tracks = state
    .get('tracks').get('tracks').valueSeq().sort((a, b) => {
      return findStart(a).diff(findStart(b));
    });

  return {
    tracks,
    step: state.get('progress').get('step')
  }
}
  
TrackList = connect(mapStateToProps)(TrackList);
  
export default TrackList;