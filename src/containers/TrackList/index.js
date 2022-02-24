import React from "react";
import { connect } from 'react-redux';

import Card from "../Card";
import TrackInfo from './TrackInfo';

import CircleIcon from '@mui/icons-material/Circle';

const segmentStartTime = (segment) => {
  return segment.get('points').get(0).get('time');
}

const segmentEndTime = (segment) => {
  return segment.get('points').get(-1).get('time');
}

let TrackList = ({ dispatch, tracks, segments, className, step }) => {
    const findStart = (seg) =>
      seg.get('segments').map((s) => segmentStartTime(segments).sort((_a, _b) => segmentStartTime(_a).diff(segmentEndTime(_b)))).get(0);
    
    if (tracks.count() !== 0) {
        return (
            <ul style={{padding: 0}}>
                {
                    tracks.valueSeq().sort((a, b) => {
                        const aStart = findStart(a);
                        const bStart = findStart(b);
                        return segmentStartTime(aStart).diff(segmentEndTime(bStart));
                      })
                      .map((track, i) => {
                        const trackSegments = track.get('segments').map((id) => segments.get(id));
                        return <TrackInfo dispatch={dispatch} track={track} segments={trackSegments} key={i} />
                      })
                }
            </ul>
        )
    } else {
        let message = null;
        if (step === -2) {
          message = <span className='button is-large is-loading' style={{ border: 0 }}>Loading...</span>
        } else {
          message = (
            <div style={{ width: '70%' }}>
              <CircleIcon color="rgb(191, 191, 191)"/>
              There are no more files in the input folder
            </div>
          );
        }
        return (
          <div style={{ display: 'flex', alignItems: 'center', textAlign: 'center', justifyContent: 'center', width: '100%' }}>
            { message }
          </div>
        );
    }

    return null;
} 

const mapStateToProps = (state) => {
    return {
      tracks: state.get('tracks').get('tracks'),
      segments: state.get('tracks').get('segments')
    }
}
  
TrackList = connect(mapStateToProps)(TrackList);
  
export default TrackList;