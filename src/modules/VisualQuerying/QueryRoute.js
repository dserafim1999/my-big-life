import React, { useState, useEffect } from "react";
import Xarrow from "react-xarrows";
import { updateQueryBlock } from "../../actions/queries";

const inputStyle={
    border: "none",
    backgroundColor: "transparent",
    resize: "none", 
    outline: "none", 
    width: "35%", 
    textAlign: "center",
    position: 'relative',
    left: "35%",
    transform: "translateY(-50%)",
    color: 'black'
  }

const QueryRoute = ({id, start, end, queryState, dispatch}) => {
    const [query, setQuery] = useState(queryState);

    useEffect(() => {
        dispatch(updateQueryBlock(query));
      },[query]);

    const inputs = (
        <div>
            <input 
                style={{...inputStyle, transform: 'translate(-50%, -50%)'}}
                placeholder="route"
                onChange={(e) => setQuery(
                    {...query, "route": e.target.value}
                )
            }/>
            <input 
                style={{...inputStyle, transform: 'translate(-150%, 50%)'}}
                placeholder="duration"
                onChange={(e) => setQuery(
                    {...query, "duration": e.target.value}
                )
            }/>
        </div>
    );

    return (
        <div id={id}>
            <Xarrow 
                labels={inputs}
                start={start}
                end={end}
                showHead={false}
                showTail={false}
                color={"grey"}
            />
        </div>
    );
};

export default QueryRoute;