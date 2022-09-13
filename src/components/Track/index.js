import React from 'react';

import TrackName from './TrackName';
import TrackSegments from './TrackSegments';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { TrackRecord } from '../../records';

const pluralize = (singular, count) => (count === 1 ? singular : singular + 's');

/**
 * Track Information container
 * 
 * @constructor
 * @param {TrackRecord} track Track to be represented
 * @param {number} pointCount Number of Points in Track
 * @param {number} segmentCount Number of Segments in Track
 * @param {function} onDownload Behaviour when Download button is clicked
 * @param {function} onShowAll Behaviour when Show All button is clicked
 * @param {function} onHideAll Behaviour when Hide All button is clicked
 */
const Track = ({ track, pointCount, segmentCount, onDownload, onShowAll, onHideAll }) => {
  return (
    <div className='fade-in'>
      <div style={{fontSize: '1.5rem'}}>
        <TrackName
            track={track}
            onDownload={onDownload}
            onShowAll={onShowAll}
            onHideAll={onHideAll}/>
      </div>
      <span style={{fontSize: '0.8rem', color: 'gray'}}>
        {segmentCount} {pluralize('segment', segmentCount)}, {pointCount} {pluralize('point', pointCount)}
      </span>
      <TrackSegments trackId={track.get('id')} />
    </div>
  );
}

const mapStateToProps = (state, { trackId, ...props }) => {
  const track = state.get('tracks').get('tracks').get(trackId);
  const getSegment = (segmentId) => state.get('tracks').get('segments').get(segmentId);
  return {
    track,
    pointCount: track.get('segments').reduce((x, segmentId) => x + getSegment(segmentId).pointCount(), 0),
    segmentCount: track.get('segments').count(),
    ...props
  }
}

Track.propTypes = {
  /** Track to be represented */
  track: PropTypes.instanceOf(TrackRecord),
  /** Number of Points in Track */
  pointCount: PropTypes.number,
  /** Number of Segments in Track */
  segmentCount: PropTypes.number,
  /** Behaviour when Download button is clicked */
  onDownload: PropTypes.func,
  /** Behaviour when Show All button is clicked */
  onShowAll: PropTypes.func,
  /** Behaviour when Hide All button is clicked */
  onHideAll: PropTypes.func
}
  
export default connect(mapStateToProps)(Track);