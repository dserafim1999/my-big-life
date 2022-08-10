import React from "react";
import { connect } from 'react-redux';

import Track from './Track';

import {
  downloadTrack, toggleTrackSegmentsVisibility
} from '../../actions/tracks';

const LOADING = <span className='button is-large is-loading' style={{ border: 0 }}>Loading</span>;

const style = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  width: '100%'
}

let TrackList = ({ dispatch, tracks, className, step, remainingCount }) => {
    if (tracks.count() !== 0) {
        return (
            <ul style={{padding: 0}}>
                {
                  tracks.map((track, i) => {
                    const remaining = '+' + remainingCount + ' days';
                    const trackId = track.get('id');

                    const onDownload = () => dispatch(downloadTrack(trackId));
                    const onToggleSegmentsVisibility = () => dispatch(toggleTrackSegmentsVisibility(trackId));
                    
                    return <Track trackId={trackId} key={i} onDownload={onDownload} onToggleSegmentsVisibility={onToggleSegmentsVisibility} remaining={remaining} />;
                  })
                }
            </ul>
        )
    } else {
      return (
        <div style={style}>
          { step === -2 ? LOADING : null }
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
      return findStart(a).getStartTime().diff(findStart(b));
    });

  return {
    tracks,
    step: state.get('process').get('step'),
    remainingCount: state.get('process').get('remainingTracks').count()
  }
}
  
TrackList = connect(mapStateToProps)(TrackList);
  
export default TrackList;