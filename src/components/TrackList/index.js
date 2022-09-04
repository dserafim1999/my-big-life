import React from "react";

import Track from './Track';
import PropTypes from 'prop-types';
import ImmutablePropTypes  from 'react-immutable-proptypes';

import { downloadTrack, toggleTrackSegmentsVisibility } from '../../actions/tracks';
import { connect } from 'react-redux';

const LOADING = <span className='button is-large is-loading' style={{ border: 0 }}>Loading</span>;

const style = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  width: '100%'
}

/**
 * Container that holds a list of tracks to display in the context of Track Processing.
 * 
 * See `TrackProcessing`
 * 
 * @param {function} dispatch Redux store action dispatcher
 * @param {ImmutablePropTypes.seq} tracks List of Tracks to display  
 * @param {number} step Processing step
 * @param {number} remainingCount Number of days remaining to process 
 */
let TrackList = ({ dispatch, tracks, step, remainingCount }) => {
    if (tracks.count() !== 0) {
        return (
            <ul style={{padding: 0}}>
                {
                  tracks.map((track, i) => {
                    const remaining = '+' + remainingCount + ' days';
                    const trackId = track.get('id');

                    const onDownload = () => dispatch(downloadTrack(trackId));
                    const onShowAllSegments = () => dispatch(toggleTrackSegmentsVisibility(trackId, true));
                    const onHideAllSegments = () => dispatch(toggleTrackSegmentsVisibility(trackId, false));
                    
                    return <Track trackId={trackId} key={i} onDownload={onDownload} onShowAll={onShowAllSegments} onHideAll={onHideAllSegments} remaining={remaining} />;
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

TrackList.propTypes = {
  /** Redux store action dispatcher */
  dispatch: PropTypes.func,
  /** List of Tracks to display */
  tracks: ImmutablePropTypes.seq,
  /** Processing step */
  step: PropTypes.number,
  /** Number of days remaining to process */
  remainingCount: PropTypes.number
}

export default TrackList;