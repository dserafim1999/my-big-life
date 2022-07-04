import moment from "moment";
import React, { useEffect, useState } from "react";
import Timeline from "../../components/Timeline";
import { groupBy } from "../../utils";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { dehighlightSegment, highlightSegment } from "../../actions/map";

import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const dateDivStyle = {
    position: "relative", 
    width: "100px",
    textAlign: "center",
}

const dateStyle = {
    position: "relative",
    fontSize: "12px",
}

const QueryResult = ({ result, dispatch }) => {
    const [seeMore, setSeeMore] = useState(false);
    const [highlighted, setHighlighted] = useState("");
    const height = 75;
    const multipleColor = "#738492", singleColor = "#821d1d";

    const resultStyle = {
        minHeight: height+"px",
        display: "flex",
        border: result.multiple ? '2px outset lightgrey' : '',
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

    const highlightResultSegment = () => {
        if (result.querySize === 1) return;

        var segIds = [];

        result.result.forEach((res) => {
            if (res.type === "interval") {
                segIds.push(res.points.id);
            }
        });
        
        const isHighlighted = highlighted === (segIds + "");
        
        dispatch(isHighlighted ? dehighlightSegment(segIds) : highlightSegment(segIds));
        setHighlighted(isHighlighted ? "" : segIds + "");
    }

    const getSeeMoreButton = () => {
        return (
            <IconButton onClick={onClick} style={{top: "50%", transform: "translateY(-50%)"}}>
                <span style={{color: multipleColor, fontSize: "14px"}}>{ "+" + result.result.length / result.querySize }</span>
                {
                    seeMore ? 
                    <KeyboardArrowUpIcon style={{color: "grey"}}/> :
                    <KeyboardArrowDownIcon style={{color: "grey"}}/>
                }
            </IconButton>
        ); 
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

    const renderDateDiv = (date, showMoreButton = false) => {
        return (
            <div style={{...dateDivStyle, padding: showMoreButton ? "" : "10px"}}>
                { showMoreButton ?
                    getSeeMoreButton() : 
                    (<span style={dateStyle}>{date}</span>)
                }
                {
                    !showMoreButton && (
                        <IconButton onClick={() => highlightResultSegment()}>
                            <VisibilityIcon></VisibilityIcon>
                        </IconButton>
                    )
                }
            </div>
        )
    }

    const renderResultTimeline = (render, date, color, showStayLegend = false, key = undefined, style = {}) => {
        return (
            <div key={key} style={{ display: "flex", ...style}}>
                { renderDateDiv(date, date === undefined) }
                <Timeline key={key} render={render} height={height} showTimeLegend={true} showStayLegend={showStayLegend} color={color}/>
            </div>
        );
    } 

    const renderMultipleTimeline = () => {
        const groupedByDate = groupBy(result.result, 'date');
    
        return ( 
            <div style={{width: "100%"}}>
                { renderResultTimeline(result.render, undefined, multipleColor, false, undefined, {overflowY: "scroll"}) }
                <div style={{overflowY: 'auto', maxHeight: '300px'}}>
                    {
                        seeMore && 
                            Object.entries(groupedByDate).map(([key, value], i) => {
                                const date = getDate(value);
                                return renderResultTimeline(getRenderObject(value), date, multipleColor, true, key + i, {backgroundColor: "#f4f4f4"});
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
            <div style={{width: '100%'}}>
                { renderResultTimeline(result.render, date, singleColor, true, undefined, {overflowY: "scroll"}) }
            </div>
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

