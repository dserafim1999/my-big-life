import React, { useEffect, useState } from "react";
import Timeline from "../../components/Timeline";
import { groupBy } from "../../utils";

const QueryResult = ({ result }) => {
    const [seeMore, setSeeMore] = useState(false);
    
    const resultStyle = {
        minHeight: '100px',
        display: "flex",
        border: result.multiple ? '2px outset lightgrey' : '2px solid white',
        borderBottom: result.multiple ? '2px outset lightgrey' : '1px solid lightgrey',
        cursor: result.multiple ? "pointer" : "drag"
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


    const onClick = (e) => {
        e.preventDefault();

        if (result.multiple) {
            setSeeMore(!seeMore);
        }
    }

    const getRenderObject = (spans) => {
        const stays = [];
        const routes = [];

        for(var i = 0 ; i < spans.length ; i++) {
            const span = spans[i];
            if (span.type === 'range') {
                stays.push(span.render);
            } else if (span.type === 'interval') {
                routes.push(span.render);
            }
        }


        return {'stays': stays, 'routes': routes};
    }

    const multipleTimeline = () => {
        const groupedByDate = groupBy(result.result, 'date');
    
        return ( 
            <div style={{width: "100%"}}>
                <Timeline onClick={onClick} render={result.render} showTimeLegend={true}/>
                <div style={{overflow: 'auto', maxHeight: '300px'}}>
                    {seeMore && Object.entries(groupedByDate).map(([key, value], i) => {
                        return ( 
                            <div style={{backgroundColor: "#f4f4f4"}}>
                                <Timeline 
                                    key={key + i} 
                                    render={getRenderObject(value)} 
                                    showTimeLegend={true} 
                                    showStayLegend={true}
                                />
                            </div>
                        )})
                    }
                </div>
            </div>
        );
    }

    return (
        <div style={resultStyle}>
            {
                result.multiple ? 
                    multipleTimeline() :
                    <Timeline 
                        render={result.render} 
                        showTimeLegend={true} 
                        showStayLegend={true}
                    />
            }
        </div>
    )
};
  
export default QueryResult;
