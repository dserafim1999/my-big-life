import React from 'react';

import Segment from '../Segment';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';

import Date from 'moment';
import { connect } from 'react-redux';
import { TrackRecord } from '../../records';
import { addSegment } from '../../actions/segments';
import { updateBounds } from '../../actions/map';
import { computeBounds } from '../../records';

const newSegmentBoxStyle = {
  borderStyle: 'dashed',
  width: '100%',
  color: 'gray',
  padding: '5px',
  margin: '5px 0 6px 0px'
}

const newSegmentParentStyle = {
  borderLeft: '4px dotted #aaa',
  marginLeft: '3px',
  paddingLeft: '6px'
}

/**
 * Container for Track's Segments
 * 
 * @constructor
 * @param {function} dispatch Redux store action dispatcher
 * @param {ImmutablePropTypes.list} segments List of the Track's Segments to display  
 * @param {TrackRecord} track Track to be represented
 * @param {Date} lastTime Soonest time in Track
 */
const TrackSegments = ({ dispatch, segments, track, lastTime }) => {
  const newSegment = () => dispatch(addSegment(track.get('id'), lastTime));
  return (
    <ul style={{listStyleType: 'none', margin: 0, padding: 0, overflowY: 'auto', maxHeight: '450px'}}>
      {
        segments.map((segment, i) => {
          let dt = null;
          const nowTime = segment.getStartTime();
          const prevSegment = segments.get(i - 1);
          const prevTime = prevSegment.getEndTime();
          if (i > 0 && nowTime && prevTime) {
            const dtVal = nowTime.from(prevTime, true);
            const action = () => dispatch(updateBounds(computeBounds([segment.get('points').get(0), prevSegment.get('points').get(-1)]).scale(1.4)));
            const dx = segment.get('points').get(0).distance(prevSegment.get('points').get(-1)) * 1000;

            dt = (
              <div style={{ ...newSegmentParentStyle, paddingTop: '2px', paddingBottom: '2px' }} className='slide-from-top-fade-in' >
                <a style={{ fontSize: '0.8rem', fontStyle: 'italic', opacity: 0.7, color: '#999' }} onClick={action}>
                  { dtVal } and { dx.toFixed(0) } meters apart
                </a>
              </div>
            );
          }
          return (
            <div key={i}>
              { dt }
              <Segment segment={segment} />
            </div>
          );
        })
      }

      <div style={newSegmentParentStyle} className='slide-from-top-fade-in' >
        <a style={newSegmentBoxStyle} className='button is-small' onClick={newSegment}>
          New Segment
        </a>
      </div>
    </ul>
  )
}

const mapStateToProps = (state, { trackId }) => {
  const track = state.get('tracks').get('tracks').get(trackId);
  const segments = track
    .get('segments').toList()
    .map((segmentId) => state.get('tracks').get('segments').get(segmentId))
    .sort((a, b) => {
      if (a.getStartTime() && b.getStartTime()) {
        if (a.getStartTime().isSame(b.getStartTime())) {
          return a.getEndTime().diff(b.getEndTime());
        } else {
          return a.getStartTime().diff(b.getStartTime());
        }
      } else {
        return;
      }
    });

  const lastTime = segments.last().getEndTime();

  return {
    track,
    segments,
    lastTime
  }
}

TrackSegments.propTypes = {
  /** Redux store action dispatcher */
  dispatch: PropTypes.func,
  /** List of the Track's Segments to display */
  segments: ImmutablePropTypes.list,
  /** Track to be represented */
  track: PropTypes.instanceOf(TrackRecord),
  /** Soonest time in Track */
  lastTime: PropTypes.instanceOf(Date),
}

export default connect(mapStateToProps)(TrackSegments);