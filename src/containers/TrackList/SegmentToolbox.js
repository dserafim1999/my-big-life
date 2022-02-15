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
import AsyncButton from '../../components/AsyncButton';

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

const btnHighlight = ' is-success is-outlined';

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
                    <a className={'button icon-button'} onClick={toggleTrack(id)}>
                        <Tooltip title="Toggle Segment Visibility"  placement="top" arrow> 
                            <VisibilityIcon sx={{ fontSize: 20 }}/>
                        </Tooltip>
                    </a>
                    <a className={'button icon-button'} onClick={fitToSegment()}>    
                        <Tooltip title="Focus on Segment"  placement="top" arrow>
                            <FitIcon sx={{ fontSize: 20 }} />
                        </Tooltip>
                    </a>
                    <AsyncButton 
                        className={'icon-button' + (editing ? btnHighlight : '')}
                        onClick={
                            (e, modifier) => {
                                modifier('is-loading');
                                toggleEditing(id)(e);
                            }
                        }
                    >
                        <Tooltip title="Edit Segment"  placement="top" arrow>
                                <EditIcon sx={{ fontSize: 20 }} />
                        </Tooltip>
                    </AsyncButton>
                    <a className={(pointDetails ? btnHighlight : '' ) + ' button icon-button'} onClick={toggleDetails(id)}>    
                        <Tooltip title="View Segment Points"  placement="top" arrow>  
                            <PointIcon sx={{ fontSize: 20 }} />
                        </Tooltip>
                    </a>
                    <a className={(splitting ? btnHighlight : '' ) + ' button icon-button'} onClick={toggleSplitting(id)}>    
                        <Tooltip title="Split Segment"  placement="top" arrow>
                            <SplitIcon sx={{ fontSize: 20 }} />
                        </Tooltip>
                    </a>
                    <a className={(joining ? btnHighlight : '' ) + ' button icon-button'} onClick={toggleJoining(id)}>    
                        <Tooltip title="Join Segment"  placement="top" arrow>
                            <JoinIcon sx={{ fontSize: 20 }} />
                        </Tooltip>
                    </a>
                    <a className={(showTimeFilter ? btnHighlight : '' ) + ' button icon-button'} onClick={toggleTF(id)}>    
                        <Tooltip title="Time Filter"  placement="top" arrow>
                            <TimeFilterIcon sx={{ fontSize: 20 }} />
                        </Tooltip>
                    </a>
                    <a className={'button icon-button'} onClick={deleteSegment(id)}>    
                        <Tooltip title="Delete Segment"  placement="top" arrow>
                            <DeleteIcon sx={{ fontSize: 20 }} />
                        </Tooltip>
                    </a>
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