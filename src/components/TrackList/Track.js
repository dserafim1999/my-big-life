import React from 'react';
import { connect } from 'react-redux';
import TrackName from './TrackName';
import TrackSegments from './TrackSegments';

const pluralize = (singular, count) => (count === 1 ? singular : singular + 's');

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
  
  export default connect(mapStateToProps)(Track);