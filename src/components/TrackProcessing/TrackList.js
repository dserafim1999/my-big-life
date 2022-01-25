import React from "react";
import Card from "../Card";
import TrackInfo from "./TrackInfo";

const TrackList = ({ tracks, dispatch }) => {
    
    const style = {
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        overflow: 'auto',
        height: 450,
    };

    return (
        <Card width="350" height="500" top="99" left="99">
            <div style={{fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center'}}>Tracks</div>
            <ul style={style}>
            {
                tracks.map((track, i) => {
                    return <TrackInfo dispatch={dispatch} track={track} key={i} />
                })
            }
            </ul>
        </Card>
    )
};

export default TrackList;