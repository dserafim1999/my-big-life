import React from "react";
import Timeline from "../../components/Timeline";

const QueryResult = ({ result }) => {
    const resultStyle = {
        minHeight: '100px',
        display: "flex",
        border: '1px solid lightgrey'
    }

    return (
        <div style={resultStyle}>
            <Timeline data={result} />
        </div>
    )
};
  
export default QueryResult;
