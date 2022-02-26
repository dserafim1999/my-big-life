import React from 'react';
import { connect } from 'react-redux';
import { addNewSegment } from '../../actions/segments';
import Segment from './Segment';

import PlusIcon from '@mui/icons-material/Add';

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

const TrackSegments = ({ dispatch, segmentIds, trackId }) => {
  const newSegment = () => dispatch(addNewSegment(trackId));
  return (
    <ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
      {
        segmentIds.map((id, i) => <Segment segmentId={id} key={i} />)
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
  const segmentIds = state
    .get('tracks').get('tracks').get(trackId).get('segments').toList()
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
    })
    .map((segment) => segment.id);

  return {
    trackId,
    segmentIds
  }
}

export default connect(mapStateToProps)(TrackSegments);