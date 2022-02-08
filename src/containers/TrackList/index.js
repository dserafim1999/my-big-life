import React from "react";
import { connect } from 'react-redux';

import Card from "../Card";
import TrackInfo from './TrackInfo';

let TrackList = ({ tracks, dispatch, segments }) => {
    const style = {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        overflow: 'auto',
        height: 450,
    };

    if (tracks.size == 0) {
        return <></>
    } else {
        return (
            <Card width="350" height="500" top="99" left="99">
                <div style={{fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center'}}>Tracks</div>
                <ul style={style}>
                {
                    tracks.valueSeq().map((track, i) => {
                        const trackSegments = track.get('segments').map((id) => segments.get(id));
                        return <TrackInfo dispatch={dispatch} track={track} segments={trackSegments} key={i} />
                      })
                }
                </ul>
            </Card>
        );
    }

};

const mapStateToProps = (state) => {
    return {
      tracks: state.get('tracks').get('tracks'),
      segments: state.get('tracks').get('segments')
    }
}
  
TrackList = connect(mapStateToProps)(TrackList);
  
export default TrackList;