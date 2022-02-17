import React from "react";
import { connect } from 'react-redux';

import Card from "../Card";
import TrackInfo from './TrackInfo';

let TrackList = ({ dispatch, tracks, segments, className }) => {
    return (
        <Card width="400" height="500" top="99" left="99">
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center'}}>Tracks</div>
                <ul className={className}>
                {
                    tracks.valueSeq().map((track, i) => {
                        const trackSegments = track.get('segments').map((id) => segments.get(id));
                        return <TrackInfo dispatch={dispatch} track={track} segments={trackSegments} key={i} />
                      })
                }
            </ul>
        </Card>
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