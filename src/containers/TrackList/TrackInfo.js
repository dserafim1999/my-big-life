import React from 'react';

import SegmentInfo from "./SegmentInfo";
import ExportIcon from '@mui/icons-material/Download';

import { downloadTrack } from '../../GPXParser';

import { toggleTrackRenaming } from '../../actions/toggles';
import { updateTrackName } from '../../actions/tracks';

const TrackInfo = ({ dispatch, track }) => {
  const { name, segments, renaming, id } = track;

  const totalPoints = segments.reduce((prev, segment) => {
    return prev + segment.points.length
  }, 0);

  const onDownload = () => downloadTrack(track);
  
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
      <div>
        <ExportIcon className='float-right clickable' style={{color: 'grey', cursor: 'pointer'}} onClick={onDownload}/>
        <div onClick={toggleEditing}>{name}</div>
      </div>
    )
  }

  return (
    <div style={{paddingLeft: '2%'}} >
      <div style={{fontSize: '1.5rem'}}>
        {title}
      </div>
      <span style={{fontSize: '0.8rem', color: 'gray'}}>{segments.length} segment{segments.length === 1 ? '' : 's'}, {totalPoints} points</span>
      <ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
        {
          segments.map((s, i) => <SegmentInfo dispatch={dispatch} segment={s} track={track} key={i} />)
        }
      </ul>
      <br/>
      <div style={{borderBottom: "2px solid #F0F0F0"}}></div>
    </div>
  )
}

export default TrackInfo;
