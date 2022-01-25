import React from "react";
import Card from "../Card";
import TrackInfo from "./TrackInfo";

const TrackList = ({ tracks, dispatch }) => {
    return (
        <Card width="300" height="450" top="99" left="99">
        <ul style={{listStyleType: 'none', margin: 0, padding: 0}}>
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