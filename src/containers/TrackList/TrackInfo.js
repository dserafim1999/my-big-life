import React from 'react';

import SegmentInfo from "./SegmentInfo";
import ExportIcon from '@mui/icons-material/Download';

import { 
  toggleTrackRenaming,
  updateTrackName,
  downloadTrack
} from '../../actions/tracks';

import { addNewSegment } from '../../actions/segments';
import { Tooltip } from '@mui/material';

import PlusIcon from '@mui/icons-material/Add';

const segmentStartTime = (segment) => {
  return segment.get('points').get(0).get('time');
}

const segmentEndTime = (segment) => {
  return segment.get('points').get(-1).get('time');
}

const TrackInfo = ({ dispatch, track, segments }) => {
  const id = track.get('id');
  const name = track.get('name');
  const renaming = track.get('renaming');

  const totalPoints = segments.reduce((prev, segment) => {
    return prev + segment.get('points').count()
  }, 0);

  const onDownload = () => dispatch(downloadTrack(id));
  
  const updateName = (e) => {
    if (e.type) {
      const val = e.target.value;
      dispatch(updateTrackName(id, val));
    }
  }

  const toggleEditing = () => dispatch(toggleTrackRenaming(id));

  let title;

  if (renaming) {
    title = (
      <div>
        <input type='text' value={name} onChange={updateName} style={{ width: '70%' }} />
        <button onClick={toggleEditing} style={{ width: '30%' }}>DONE</button>
      </div>
    );
  } else {
    title = (
      <div style={{alignItems: 'center'}}>
        <div onClick={toggleEditing}>{name}</div>
        <Tooltip title="Export Track"  placement="top" arrow>
          <ExportIcon  className='float-right clickable'  style={{float: 'right', color: 'grey'}} onClick={onDownload}/>
        </Tooltip>
      </div>
    )
  }

  return (
    <div className='fade-in' style={{paddingLeft: '2%'}} >
      <div style={{fontSize: '1.5rem'}}>
        {title}
      </div>
      <span style={{fontSize: '0.8rem', color: 'gray'}}>{segments.count()} segment{segments.count() === 1 ? '' : 's'}, {totalPoints} points</span>
      <ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
        {
          segments
            .sort((a, b) => {
              if (segmentStartTime(a).isSame(segmentStartTime(b))) {
                return segmentEndTime(a).diff(segmentEndTime(b));
              } else {
                return segmentStartTime(a).diff(segmentStartTime(b));
              }
            })
            .map((s, i) => <SegmentInfo dispatch={dispatch} segment={s} track={track} key={i} />)
        }
        <div style={{ borderLeft: '4px dotted #aaa', marginLeft: '3px', paddingLeft: '6px' }} className='slide-from-top-fade-in' >
          <a style={{
            borderStyle: 'dashed',
            width: '100%',
            color: 'gray',
            padding: '5px',
            margin: '5px 0 6px 0px'
          }} className='button is-small' onClick={() => dispatch(addNewSegment(id))}>
            <PlusIcon/>
            new segment
          </a>
        </div>
      </ul>
      <br/>
    </div>
  )
}

export default TrackInfo;
