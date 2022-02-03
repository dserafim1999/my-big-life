import React from 'react';
import { 
  toggleSegmentVisibility,
  toggleSegmentEditing,
  removeSegment,
  updateBounds,
  toggleSegmentSpliting
} from '../../actions';

import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FitIcon from '@mui/icons-material/ZoomOutMap';
import SplitIcon from '@mui/icons-material/Height';

import { Col, Container } from 'react-bootstrap';

const SegmentInfo = ({ dispatch, segment }) => {
  const { id, name, points, start, end, display, color, editing, spliting } = segment;
  
  const toggleTrack = (segmentId) => {
    return () => dispatch(toggleSegmentVisibility(segmentId));
  }

  const toggleEditing = (segmentId) => {
    return () => dispatch(toggleSegmentEditing(segmentId));
  }

  const deleteSegment = (segmentId) => {
    return () => dispatch(removeSegment(segmentId))
  }

  const fitToSegment = () => {
    return () => dispatch(updateBounds(segment.bounds))
  }

  const toggleSpliting = (segmentId) => {
    return () => dispatch(toggleSegmentSpliting(segmentId))
  }

  return (
    <div style={{border: '1px solid #F0F0F0'}}>
        <Container style={{width: '15%', float: 'right'}} >
            <Col>
                <VisibilityIcon style={{color: 'gray', cursor: 'pointer'}} onClick={toggleTrack(id)}/>
            </Col>
        </Container>
        <div style={{width: '85%'}} >
        <li style={{borderLeft: '10px solid ' + color, paddingLeft: '2%', opacity: display ? 1 : 0.5}} >
        <div>
            <div style={{fontSize: '1rem', color: 'gray'}}>{name.length === 0 ? 'untitled' : name} <span style={{fontSize: '0.8rem', color: 'gray'}}>{points.length} points</span></div>
            <div style={{fontSize: '0.8rem', color: 'gray'}}>{start.format('L')} - {end.format('L')}, {end.fromNow()}</div>
            <div style={{fontSize: '0.8rem', color: 'gray'}}>{start.format('LT')} - {end.format('LT')}, {start.to(end, true)}</div>
        </div>

        <div style={{marginTop: '2px'}}>
            <Col>
                <EditIcon style={{color:  editing ? 'black' : 'grey', cursor: 'pointer'}} onClick={toggleEditing(id)}/>
                <DeleteIcon style={{color: 'grey', cursor: 'pointer'}} onClick={deleteSegment(id)}/>
                <FitIcon style={{color: 'grey', cursor: 'pointer'}} onClick={fitToSegment()}/>
                <SplitIcon style={{color: spliting ? 'black' : 'grey', cursor: 'pointer'}} onClick={toggleSpliting(id)}/>
            </Col>
        </div>
        </li>
        </div>
    </div>
  )
}

const TrackInfo = ({ dispatch, track }) => {
  const { name, segments } = track
  return (
    <div style={{paddingLeft: '2%'}} >
      <div style={{fontSize: '1rem', fontWeight: 'bold'}}>{name} </div>
      <span style={{fontSize: '0.8rem', color: 'gray'}}>{segments.length} segment{segments.length === 1 ? '' : 's'}</span>
      <ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
        {
          segments.map((s, i) => <SegmentInfo dispatch={dispatch} segment={s} key={i} />)
        }
      </ul>
      <br/>
      <div style={{borderBottom: "2px solid #F0F0F0"}}></div>
    </div>
  )
}

export default TrackInfo;
