import React from "react";
import { connect } from 'react-redux';

import Card from "../Card";
import TrackInfo from './TrackInfo';

let TrackList = ({ dispatch, tracks, segments, className }) => {
    return (
            <ul style={{padding: 0}}>
                {
                    tracks.valueSeq().map((track, i) => {
                        const trackSegments = track.get('segments').map((id) => segments.get(id));
                        return <TrackInfo dispatch={dispatch} track={track} segments={trackSegments} key={i} />
                      })
                }
            </ul>
    )
} 

const mapStateToProps = (state) => {
    return {
      tracks: state.get('tracks').get('tracks'),
      segments: state.get('tracks').get('segments')
    }
}
  
TrackList = connect(mapStateToProps)(TrackList);
  
export default TrackList;