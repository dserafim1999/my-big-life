import React from "react";
import moment from "moment";

const QueryResult = ({ result }) => {
    const resultStyle = {
        minHeight: '100px',
        border: '1px solid lightgrey'
    }

    return (
        <div style={resultStyle}>
            {result.map((x) => <div>{moment(x.date).format("DD/MM/YYYY")}: {x.id} </div>)}
        </div>
    )
};
  
export default QueryResult;
