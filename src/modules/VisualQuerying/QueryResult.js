import moment from "moment";
import React, { useEffect, useState } from "react";
import Timeline from "../../components/Timeline";
import { groupBy } from "../../utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";


const dateDivStyle = {
    position: "relative", 
    width: "100px"
}

const dateStyle = {
    position: "absolute",
    top: "50%",
    fontSize: "12px",
    left: "50%",
    transform: "translate(-50%,-50%)"
}

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

    const getSeeMoreButton = () => {
        const style = {
            color: "grey"
        }

        return seeMore ? 
            <KeyboardArrowUpIcon style={style}/> :
            <KeyboardArrowDownIcon style={style}/>; 
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

    const renderDateDiv = (date) => {
        return (
            <div onClick={onClick} style={dateDivStyle}>
                <span style={dateStyle}>{date}</span>
            </div>
        )
    }

    const renderResultTimeline = (render, date,  showStayLegend = false, key = undefined, style = {}) => {
        return (
            <div key={key} style={{ display: "flex", ...style}}>
                { renderDateDiv(date) }
                <Timeline render={render} showTimeLegend={true} showStayLegend={showStayLegend}/>
            </div>
        );
    } 

    const renderMultipleTimeline = () => {
        const groupedByDate = groupBy(result.result, 'date');
    
        return ( 
            <div style={{width: "100%"}}>
                { renderResultTimeline(result.render, getSeeMoreButton(), false) }
                <div style={{overflow: 'auto', maxHeight: '300px'}}>
                    {
                        seeMore && 
                            Object.entries(groupedByDate).map(([key, value], i) => {
                                const date = getDate(value);
                                return renderResultTimeline(getRenderObject(value), date, true, key + i, {backgroundColor: "#f4f4f4"});
                            }) 
                    }
                </div>
            </div>
        );
    }

    const getDate = (results) => {
        return results.length > 0 ? moment(results[0].date).format("DD/MM/YYYY") : "";
    }

    const renderSingleTimeline = () => {
        const date = getDate(result.result);

        return (
            <>
                { renderDateDiv(date) }
                <Timeline 
                    render={result.render} 
                    showTimeLegend={true} 
                    showStayLegend={true}
                />
            </>
        );
    }

    return (
        <div style={resultStyle}>
            {
                result.multiple ? 
                renderMultipleTimeline() :
                renderSingleTimeline()
            }
        </div>
    )
};
  
export default QueryResult;
