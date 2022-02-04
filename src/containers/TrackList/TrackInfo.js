import React from 'react';

import SegmentInfo from "./SegmentInfo";
import ExportIcon from '@mui/icons-material/Download';
import { downloadTrack } from '../../GPXParser';

const TrackInfo = ({ dispatch, track }) => {
  
  const exportTrack = (track) => {
    return () => downloadTrack(track);
  }

  const { name, segments } = track
  return (
    <div style={{paddingLeft: '2%'}} >
      <div style={{fontSize: '1rem', fontWeight: 'bold'}}>{name} </div>
      <span style={{fontSize: '0.8rem', color: 'gray'}}>{segments.length} segment{segments.length === 1 ? '' : 's'}</span>
      <ExportIcon style={{color: 'grey', cursor: 'pointer'}} onClick={ exportTrack(track) }/>
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
