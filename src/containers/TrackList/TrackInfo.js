import React from 'react';

import SegmentInfo from "./SegmentInfo";
import ExportIcon from '@mui/icons-material/Download';

import { toggleTrackRenaming, updateTrackName, downloadTrack } from '../../actions/tracks';

import { Tooltip } from '@mui/material';


const TrackInfo = ({ dispatch, track, segments }) => {
  const id = track.get('id');
  const name = track.get('name');
  const renaming = track.get('renaming');

  const totalPoints = segments.reduce((prev, segment) => {
    return prev + segment.get('points').count()
  }, 0);

  const onDownload = () => downloadTrack(segments.valueSeq(), name);
  
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
      <span style={{fontSize: '0.8rem', color: 'gray'}}>{segments.length} segment{segments.count() === 1 ? '' : 's'}, {totalPoints} points</span>
      <ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
        {
          segments
            .sort((a, b) => a.get('start').diff(b.get('start')))
            .map((s, i) => <SegmentInfo dispatch={dispatch} segment={s} track={track} key={i} />)
        }
      </ul>
      <br/>
      <div style={{borderBottom: "2px solid #F0F0F0"}}></div>
    </div>
  )
}

export default TrackInfo;
