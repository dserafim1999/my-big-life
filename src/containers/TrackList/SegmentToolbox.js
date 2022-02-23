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

import { 
    updateBounds,
    addAlert,
    removeAlert
} from '../../actions/ui';
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


let SegmentButton = ({children, typeClass, description, onClick}) => {
    return (
        <a className={typeClass + ' button'} onClick={onClick}>    
            <Tooltip title={description}  placement="top" arrow>  
                { children }
            </Tooltip>
        </a>
    );
}

let SegmentToolbox = ({ dispatch, segment, isPopup=false }) => {
    const id = segment.get('id');
    const start = segment.get('start');
    const end = segment.get('end');
    const editing = segment.get('editing');
    const splitting = segment.get('splitting');
    const joining = segment.get('joining');
    const pointDetails = segment.get('pointDetails');
    const bounds = segment.get('bounds').toJS();
    const showTimeFilter = segment.get('showTimeFilter');
    const filterStart = segment.get('timeFilter').get(0);
    const filterEnd = segment.get('timeFilter').get(1);
  
    const INFO_TIME = 100;

    const btnHighlight = isPopup ? 'icon-popup-button is-success' : 'icon-button is-success';
    const btn = isPopup ? 'icon-popup-button' : 'icon-button';

    const toggleTrack = (segmentId) => {
        return () => dispatch(toggleSegmentVisibility(segmentId));
    }

    const toggleEditing = (segmentId) => {
        return () => {
            dispatch(toggleSegmentEditing(segmentId))
      
            const ref = 'EDIT_INFO';
            if (!editing) {
              const action = addAlert((
                <div>
                  <div>Editing is only possible at certain zoom levels. Zoom in if you can't see any markers.</div>
                  <div>Drag existing points to move their position. Right-click to remove them.</div>
                  <div>Drag or click on the (+) marker to add a point.</div>
                </div>
              ), 'success', INFO_TIME, ref);
              dispatch(action);
            } else {
              dispatch(removeAlert(null, ref));
            }
        }
    }
    
    const deleteSegment = (segmentId) => {
        return () => dispatch(removeSegment(segmentId));
    }
    
    const fitToSegment = () => {
        return () => dispatch(updateBounds(bounds));
    }
    
    const toggleSplitting = (segmentId) => {
        return () => {
            dispatch(toggleSegmentSplitting(segmentId));
      
            const ref = 'SPLIT_INFO';
            if (!splitting) {
              const action = addAlert((
                <div>
                  <div>Spliting is only possible at certain zoom levels. Zoom in if you can't see any markers.</div>
                  <div>Click on a marker to split the segment</div>
                </div>
              ), 'success', INFO_TIME, ref);
              dispatch(action);
            } else {
              dispatch(removeAlert(null, ref));
            }
        }
    }
    
    const toggleJoining = (segmentId) => {
        return () => {
            try {
              dispatch(toggleSegmentJoining(segmentId));
      
              const ref = 'JOIN_INFO';
              if (!joining) {
                const action = addAlert((
                  <div>
                    <div>Joining is only possible at certain zoom levels. Zoom in if you can't see any markers.</div>
                    <div>The possible joins are highlighted, click them to join.</div>
                  </div>
                ), 'success', INFO_TIME, ref);
                dispatch(action);
              } else {
                dispatch(removeAlert(null, ref));
              }
            } catch (e) {
              dispatch(addAlert(e.message));
            }
        }
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
            <div style={{ width: '100%' }} className='control has-addons'>
                <Col>
                    <SegmentButton typeClass={btn} description={'Toggle Segment Visibility'} onClick={toggleTrack(id)}>
                        <VisibilityIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }}/>
                    </SegmentButton>

                    <SegmentButton typeClass={btn} description={'Focus on Segment'} onClick={fitToSegment()}>
                        <FitIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>

                    <AsyncButton 
                        className={(editing ? btnHighlight : btn)}
                        onClick={
                            (e, modifier) => {
                                modifier('is-loading');
                                toggleEditing(id)(e);
                            }
                        }
                    >
                        <Tooltip title="Edit Segment"  placement="top" arrow>
                                <EditIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                        </Tooltip>
                    </AsyncButton>

                    <SegmentButton typeClass={(pointDetails ? btnHighlight : btn )} description={'View Segment Points'} onClick={toggleDetails(id)}>
                        <PointIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>

                    <SegmentButton typeClass={(splitting ? btnHighlight : btn )} description={'Split Segment'} onClick={toggleSplitting(id)}>
                        <SplitIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>
                                        
                    <SegmentButton typeClass={(joining ? btnHighlight : btn )} description={'Join Segment'} onClick={toggleJoining(id)}>
                        <JoinIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>

                    <SegmentButton typeClass={(showTimeFilter ? btnHighlight : btn )} description={'Filter Points by Time'} onClick={toggleTF(id)}>
                        <TimeFilterIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>
                    
                    <SegmentButton typeClass={btn} toggleable={false} description={'Delete Segment'} onClick={deleteSegment(id)}>
                        <DeleteIcon className={'absolute-icon-center'} sx={{ fontSize: 20 }} />
                    </SegmentButton>
                </Col>
            </div>
            {
            showTimeFilter
                ? <TimeSlider start={start} initialStart={filterStart} end={end} initialEnd={filterEnd} onChange={updateFilter(id)}/>
                : null
            }
        </div>
    );
}

export default SegmentToolbox;