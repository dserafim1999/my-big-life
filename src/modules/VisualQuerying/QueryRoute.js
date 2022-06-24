import React, { useState, useEffect } from "react";
import Xarrow from "react-xarrows";
import { updateQueryBlock } from "../../actions/queries";
import QueryNumberPicker from "../../components/Form/QueryNumberPicker";

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

const QueryRoute = ({id, start, end, queryState, dispatch}) => {
    const [query, setQuery] = useState(queryState);

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

export default QueryRoute;