import React, { useEffect } from "react";
import Timeline from "../../components/Timeline";

const QueryResult = ({ result }) => {

    const resultStyle = {
        height: '100px',
        display: "flex",
        border: '1px solid lightgrey'
    }

    useEffect(() => {
        const onScroll = (e) => {
                e.preventDefault();
        };
        // clean up code
        window.removeEventListener('wheel', onScroll);
        window.addEventListener('wheel', onScroll, { passive: false });
        return () => window.removeEventListener('wheel', onScroll);
    }, []);

    return (
        <div style={resultStyle}>
            <Timeline data={result} showTimeLegend={true}/>
        </div>
    )
};
  
export default QueryResult;
