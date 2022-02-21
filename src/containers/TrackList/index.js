import React from "react";
import { connect } from 'react-redux';

import Card from "../Card";
import TrackInfo from './TrackInfo';

let TrackList = ({ dispatch, tracks, segments, className }) => {
    const findStart = (seg) =>
        seg.get('segments').map((s) => segments.get(s).get('start')).sort((_a, _b) => _a.get('start').diff(_b.get('start'))).get(0);
    
    if (tracks.count() !== 0) {
        return (
            <ul style={{padding: 0}}>
                {
                    tracks.valueSeq().sort((a, b) => {
                        const aStart = findStart(a)
                        const bStart = findStart(b)
                        return aStart.get('start').diff(bStart.get('start'))
                      })
                      .map((track, i) => {
                        const trackSegments = track.get('segments').map((id) => segments.get(id));
                        return <TrackInfo dispatch={dispatch} track={track} segments={trackSegments} key={i} />
                      })
                }
            </ul>
        )
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