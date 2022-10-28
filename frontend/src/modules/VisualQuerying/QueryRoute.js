import React, { useState, useEffect } from "react";

import Xarrow from "react-xarrows";
import QueryNumberPicker from "../../components/Form/QueryNumberPicker";
import PropTypes from 'prop-types';

import { updateQueryBlock } from "../../actions/queries";

const inputStyle={
    border: "none",
    backgroundColor: "transparent",
    resize: "none", 
    outline: "none", 
    textAlign: "center",
    fontSize: "12px",
    position: "relative",
    color: "black"
}

/**
 * Route representation on Query Timeline
 * 
 * @param {number} id Route id
 * @param {string} start Origin Query Stay id 
 * @param {string} end Destination Query Stay id
 * @param {object} queryState Current query state
 * @param {function} dispatch Redux store action dispatcher
 */

const QueryRoute = ({id, start, end, queryState, dispatch}) => {
    const [query, setQuery] = useState(queryState);

    console.log(start)

    useEffect(() => {
        dispatch(updateQueryBlock(query));
      },[query]);

    const inputs = (
        <div style={{display: "grid"}}>
            <input 
                style={inputStyle}
                placeholder="route"
                onChange={(e) => setQuery(
                    {...query, "route": e.target.value}
                )
            }/>
            <QueryNumberPicker
                value={query["duration"]}
                onChange={(value) => setQuery(
                    {...query, "duration": value}
                )}
                onClear={() => setQuery(
                    {...query, "duration": ""}
                )}
                label="Duration"
                placeholder="duration"
                suffix="min"
                showOperators={true}
                style={{ fontSize: "12px" }}
            />
        </div>
    );

    return (
        <div id={id}>
            <Xarrow 
                labels={inputs}
                path="grid"
                start={start}
                end={end}
                showHead={false}
                showTail={false}
                color="grey"
            />
        </div>
    );
};

QueryRoute.propTypes = {
    /** Route id */
    id: PropTypes.number,
    /** Origin Query Stay id  */
    start: PropTypes.string,
    /** Destination Query Stay id */
    end: PropTypes.string,
    /** Current query state */
    queryState: PropTypes.object,
    /** Redux store action dispatcher */
    dispatch: PropTypes.func,
}

export default QueryRoute;