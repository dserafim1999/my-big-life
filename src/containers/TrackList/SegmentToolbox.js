import React from 'react';

import { 
    toggleSegmentVisibility,
    toggleSegmentEditing,
    toggleSegmentSplitting,
    toggleSegmentJoining,
    toggleSegmentPointDetails,
    toggleTimeFilter,
    updateTimeFilterSegment,
    removeSegment,
  } from '../../actions/segments';

import { updateBounds } from '../../actions/ui';
import TimeSlider from '../../components/TimeSlider';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FitIcon from '@mui/icons-material/ZoomOutMap';
import SplitIcon from '@mui/icons-material/Expand';
import JoinIcon from '@mui/icons-material/Compress';
import PointIcon from '@mui/icons-material/LocationOn';
import TimeFilterIcon from '@mui/icons-material/EventNote';

import { Col } from 'react-bootstrap';
import { Tooltip } from '@mui/material';

let SegmentToolbox = ({ dispatch, segment }) => {
    const id = segment.get('id');
    const start = segment.get('start');
    const end = segment.get('end');
    const editing = segment.get('editing');
    const splitting = segment.get('splitting');
    const joining = segment.get('joining');
    const pointDetails = segment.get('pointDetails');
    const bounds = segment.get('bounds').toJS();
    const showTimeFilter = segment.get('showTimeFilter');
  
    const toggleTrack = (segmentId) => {
        return () => dispatch(toggleSegmentVisibility(segmentId));
    }

    const toggleEditing = (segmentId) => {
        return () => dispatch(toggleSegmentEditing(segmentId));
    }
    
    const deleteSegment = (segmentId) => {
        return () => dispatch(removeSegment(segmentId));
    }
    
    const fitToSegment = () => {
        return () => dispatch(updateBounds(bounds));
    }
    
    const toggleSplitting = (segmentId) => {
        return () => dispatch(toggleSegmentSplitting(segmentId));
    }
    
    const toggleJoining = (segmentId) => {
        return () => dispatch(toggleSegmentJoining(segmentId));
    } 
    
    const toggleDetails = (segmentId) => {
        return () => dispatch(toggleSegmentPointDetails(segmentId));
    }
    
    const updateFilter = (segmentIndex) => {
        return (lower, higher) => dispatch(updateTimeFilterSegment(segmentIndex, lower, higher));
    }

    const toggleTF = (segmentIndex) => {
        return () => {
          dispatch(toggleTimeFilter(segmentIndex));
        }
    }

    return (
        <div>
            <div style={{marginTop: '2px', display: 'flex', justifyContent: 'space-around' }}>
                <Col>
                <Tooltip title="Toggle Segment Visibility"  placement="top" arrow>
                    <VisibilityIcon className='clickable segmentButton' onClick={toggleTrack(id)} sx={{ fontSize: 30 }}/>
                </Tooltip>
                <Tooltip title="Focus on Segment"  placement="top" arrow>
                    <FitIcon className='clickable segmentButton' onClick={fitToSegment()} sx={{ fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="Edit Segment"  placement="top" arrow>
                    <EditIcon className={(editing ? 'selected' : 'clickable') + ' segmentButton'} onClick={toggleEditing(id)} sx={{ fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="View Segment Points"  placement="top" arrow>  
                    <PointIcon className={(pointDetails ? 'selected' : 'clickable' ) + ' segmentButton'} onClick={toggleDetails(id)} sx={{ fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="Split Segment"  placement="top" arrow>
                    <SplitIcon className={(splitting ? 'selected' : 'clickable' ) + ' segmentButton'} onClick={toggleSplitting(id)} sx={{ fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="Join Segment"  placement="top" arrow>
                    <JoinIcon className={(joining ? 'selected' : 'clickable' ) + ' segmentButton'} onClick={toggleJoining(id)} sx={{ fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="Time Filter"  placement="top" arrow>
                    <TimeFilterIcon className={(showTimeFilter ? 'selected' : 'clickable' ) + ' segmentButton'} onClick={toggleTF(id)} sx={{ fontSize: 30 }} />
                </Tooltip>
                <Tooltip title="Delete Segment"  placement="top" arrow>
                    <DeleteIcon className='clickable segmentButton' onClick={deleteSegment(id)} sx={{ fontSize: 30 }} />
                </Tooltip>
                </Col>
            </div>
            {
            showTimeFilter
                ? <TimeSlider start={start} end={end} onChange={updateFilter(id)}/>
                : null
            }
        </div>
    );
}

export default SegmentToolbox;