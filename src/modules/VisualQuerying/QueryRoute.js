import React from "react";
import Xarrow from "react-xarrows";

const QueryRoute = ({id, start, end, dispatch}) => {
    return (
        <div id={id}>
            <Xarrow  start={start} end={end} />
        </div>
    );
};

export default QueryRoute;