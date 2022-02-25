import React from "react";
import { connect } from 'react-redux';

import Track from './Track';

const LOADING = <span className='button is-large is-loading' style={{ border: 0 }}>Loading</span>;

const EMPTY_FOLDER = (
  <div style={{ width: '70%' }}>
    There are no more files at the input folder
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
                    return <Track trackId={track} key={i} />
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
    })
    .map((segment) => segment.get('id'));

  return {
    step: state.get('progress').get('step'),
    tracks
  }
}
  
TrackList = connect(mapStateToProps)(TrackList);
  
export default TrackList;