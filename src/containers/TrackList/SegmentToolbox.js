import React from 'react';
import { connect } from 'react-redux';

import {
  toggleSegmentEditing,
  removeSegment,
  toggleSegmentSplitting,
  toggleSegmentJoining,
  toggleSegmentPointDetails,
  toggleTimeFilter,
  updateTimeFilterSegment,
  fitSegment
} from '../../actions/segments';

import { addAlert, removeAlert } from '../../actions/general';
import TimeSlider from '../../components/TimeSlider';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FitIcon from '@mui/icons-material/ZoomOutMap';
import SplitIcon from '@mui/icons-material/Expand';
import JoinIcon from '@mui/icons-material/Compress';
import PointIcon from '@mui/icons-material/LocationOn';
import TimeFilterIcon from '@mui/icons-material/EventNote';

import { Col } from 'react-bootstrap';
import IconButton from '../../components/Buttons/IconButton';

const INFO_TIME = 5;

let SegmentButton = ({children, description, onClick, highlighted, disabled}) => {
  const className = [];
  if (highlighted) {
    className.push('is-selected', 'is-outlined');
  }
  if (disabled) {
    className.push('is-disabled');
  }
  
  return (
    <IconButton title={description} className={className.join(' ')} onClick={disabled ? null : onClick}>    
      { children }
    </IconButton>
  );
}

const EDIT_ALERT = (
  <div>
    <div>Editing is only possible at certain zoom levels. Zoom in if you can't see any markers.</div>
    <div>Drag existing points to move their position. Right-click to remove them.</div>
    <div>Drag or click in the (+) marker to add a point.</div>
  </div>
);

const JOIN_ALERT = (
  <div>
    <div>Joining is only possible at certain zoom levels. Zoom in if you can't see any markers.</div>
    <div>The possible joins are highlighted, click them to join.</div>
  </div>
);

const SPLIT_ALERT = (
  <div>
    <div>Splitting is only possible at certain zoom levels. Zoom in if you can't see any markers.</div>
    <div>Click on a marker to split the segment</div>
  </div>
);

const toggleAlert = (dispatch, ref, alert, should) => {
  if (should) {
    dispatch(removeAlert(null, ref));
  } else {
    dispatch(addAlert(alert, 'success', INFO_TIME, ref));
  }
}
    
let SegmentToolbox = ({ dispatch, segmentId, start, end, editing, splitting, joining, pointDetails, showTimeFilter, filterStart, filterEnd }) => {
  
  const toggleEditing = () => {
    dispatch(toggleSegmentEditing(segmentId));
    toggleAlert(dispatch, 'EDIT_INFO', EDIT_ALERT, editing);
  }

  const deleteSegment = () => dispatch(removeSegment(segmentId));
  
  const toggleJoining = () => {
    dispatch(toggleSegmentJoining(segmentId));
    toggleAlert(dispatch, 'JOIN_INFO', JOIN_ALERT, editing);
  }

  const toggleSplitting = () => {
    dispatch(toggleSegmentSplitting(segmentId));
    toggleAlert(dispatch, 'SPLIT_INFO', SPLIT_ALERT, editing);
  }

  const fitToSegment = () => dispatch(fitSegment(segmentId));
  const toggleDetails = () => dispatch(toggleSegmentPointDetails(segmentId));
  const updateFilter = (lower, higher) => dispatch(updateTimeFilterSegment(segmentId, lower, higher));
  const toggleTF = () => dispatch(toggleTimeFilter(segmentId));

    return (
        <div>
            <div style={{ width: '100%', textAlign:'center' }} className='control has-addons'>
                <Col>
                    <SegmentButton description={'Focus on Segment'} onClick={fitToSegment}>
                        <FitIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>

                    <SegmentButton highlighted={editing} description={'Edit Segment'} onClick={toggleEditing} disabled={!start}>
                        <EditIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>

                    <SegmentButton highlighted={pointDetails} description={'Inspect Points'} onClick={toggleDetails}>
                        <PointIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>

                    <SegmentButton highlighted={splitting} description={'Split Segment'} onClick={toggleSplitting} disabled={!start}>
                        <SplitIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>
                                        
                    <SegmentButton highlighted={joining} disabled={!start} description={'Join Segment'} onClick={toggleJoining}>
                        <JoinIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>

                    <SegmentButton highlighted={showTimeFilter} disabled={!start} description={'Filter Points by Time'} onClick={toggleTF}>
                        <TimeFilterIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>
                    
                    <SegmentButton toggleable={false} description={'Delete Segment'} onClick={deleteSegment} disabled={!start}>
                        <DeleteIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>
                </Col>
            </div>
            {
            showTimeFilter
                ? <TimeSlider start={start} initialStart={filterStart} end={end} initialEnd={filterEnd} onChange={updateFilter}/>
                : null
            }
        </div>
    );
}

const mapStateToProps = (state, { segment }) => {
  return {
    segmentId: segment.get('id'),
    start: segment.getStartTime(),
    end: segment.getEndTime(),
    editing: segment.get('editing'),
    splitting: segment.get('splitting'),
    joining: segment.get('joining'),
    pointDetails: segment.get('pointDetails'),
    showTimeFilter: segment.get('showTimeFilter'),
    filterStart: segment.get('timeFilter').get(0),
    filterEnd: segment.get('timeFilter').get(1)
  }
}

export default connect(mapStateToProps)(SegmentToolbox);