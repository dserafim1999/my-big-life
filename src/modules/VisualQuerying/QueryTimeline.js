import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { connect } from 'react-redux';

import Card from "../../containers/Card";
import QueryStay from "./QueryStay";
import QueryRoute from './QueryRoute';
import QueryDatePicker from "./QueryDatePicker";

import { addQueryStayAndRoute, addQueryStay, executeQuery, resetQuery, removeQueryStay } from '../../actions/queries';
import AsyncButton from '../../components/Buttons/AsyncButton';

const QueryTimeline = ({ dispatch, query, isQueryLoading }) => {
    const timelineWidthPercentage = 0.9; // sets percentage of width card will occupy
    const relativeOffset = window.innerWidth * (1 - timelineWidthPercentage); // coords offset related to the percentage the Card's width will occupy on screen 
    const height = 110;
    const stayWidth = 200;

    const timelineRef = useRef();
    
    const [id, setId] = useState(0);
    const [dateOpen, setIsDateOpen] = useState(false);
    const [date, setDate] = useState("--/--/----");
    const [fullWidth, setFullWidth] = useState(window.innerWidth * timelineWidthPercentage);

    useEffect(() => {
        const handleResize = () => {
            setFullWidth(window.innerWidth * timelineWidthPercentage);
        }
        window.addEventListener('resize', handleResize)
    });

    const defaultRoute = {
        route: "",
        duration:"",
        start: "",
        end: "",
        temporalStartRange: "",
        temporalEndRange: ""
    };

    const defaultStay = {
        location: "",
        spatialRange: "",
        start: "",
        end: "",
        duration: "",
        temporalEndRange: "",
        temporalStartRange: ""
    };

    const onDoubleClick = (e) => {
        window.getSelection().empty();
        const startX = e.screenX - relativeOffset;
        var lastStayX;
        const maxX = timelineRef.current.offsetWidth - stayWidth;
        
        lastStayX = query.size > 0 ? query.toJS().pop().queryBlock.x : undefined;

        // only creates stay if inside timeline bounds and if position is after last stay
        const inBounds = startX <= maxX  &&
            (lastStayX === undefined) ? 
                startX >= 0 :
                startX > lastStayX && lastStayX + stayWidth <= maxX;

        if (inBounds && e.target.className.includes("timeline")) {
            var stayId;
            var queryState = {...defaultStay, queryBlock: {x: startX}};


            if(query.size > 0) {
                const routeId = id;
                stayId = routeId + 1;
                queryState["queryBlock"]["id"] = stayId;

                dispatch(addQueryStayAndRoute(
                    queryState,
                    {...defaultRoute, queryBlock:{id: routeId}},
                ));                
            } else {
                stayId = id;
                queryState["queryBlock"]["id"] = stayId;

                dispatch(addQueryStay(queryState));
            }
            
            setId(stayId + 1);
        }
    }

    const onDragStay = (id) => {
        const allQueryBlocks = query.toJS();
        const stayQueryBlock = allQueryBlocks.find((obj) => obj.queryBlock.id === id).queryBlock;

        return stayQueryBlock;
    }

    const displayTimeline = () => {
        const queryBlocks = [];
        const allQueryBlocks = query.toJS();
        
        for (var i = 0; i < allQueryBlocks.length; i++) {
            if (i % 2 === 0) {
                const stayBlock = {
                    type: 'stay',
                    id: allQueryBlocks[i].queryBlock.id,
                    width: stayWidth,
                    maxWidth: timelineRef.current.offsetWidth,
                    maxHeight: height,
                    queryState: allQueryBlocks[i],
                    dispatch: dispatch,
                    onDragStay: onDragStay,
                    onRemove: onStayRemove
                };

                queryBlocks.push(stayBlock);
            } else {        
                const prevStayId = allQueryBlocks[i - 1].queryBlock.id;
                const routeId = allQueryBlocks[i].queryBlock.id;
                const nextStayId = allQueryBlocks[i + 1].queryBlock.id;

                const routeBlock = {
                    type: 'route',
                    id: routeId,
                    queryState: allQueryBlocks[i],
                    start: prevStayId.toString(), 
                    end: nextStayId.toString(),
                    dispatch: dispatch
                };
                
                queryBlocks.push(routeBlock);
            }
        }


        return (
            <div className='timeline' ref={timelineRef} style={{flexGrow: '1', height: '100%'}}>
                            {queryBlocks.map((block) => {
                                if (block.type === 'stay') {
                                    return <QueryStay key={block.id} {...block} />
                                } else if (block.type === 'route') {
                                    return <QueryRoute key={block.id} {...block} />
                                }
                            })}
            </div>
        );
    }

    const onSubmit = () => {
        dispatch(executeQuery(
                {
                    "data": [
                        {
                            "date": date
                        },
                        ...query.toArray()
                    ]
                }
            )
        );
    }

    const onChangeDate = (newValue) => {
        setDate(newValue);
    }

    const onCloseDate = (clear) => {
        if (clear) {
          setDate("--/--/----");
        }
  
        setIsDateOpen(false);
    }

    const onClearQuery = () => {
        setId(0);
        setDate("--/--/----");
        dispatch(resetQuery());
    }

    const onStayRemove = (id) => {
        dispatch(removeQueryStay(id));
    }

    return (
        <div onDoubleClick={onDoubleClick} style={{width: "100%", textAlign: "center"}}>
            <Card 
                width={fullWidth} 
                height={height} 
                style={{margin: '25px'}}
                isDraggable={false}
            >
                <div className="horizontalAxis"/>
                <div style={{width: '100%', height: '100%', display: 'flex'}}>
                        <div style={{zIndex: "1", backgroundColor: "white"}}>
                            <QueryDatePicker
                                open={dateOpen}
                                value={date}
                                onChange={(newValue) => onChangeDate(newValue)}
                                onClick={() => setIsDateOpen(true)}
                                onClose={(clear) => onCloseDate(clear)}
                            />
                        </div>
                        { displayTimeline() }
                        <div style={{zIndex: "1", backgroundColor: "white"}}>
                            <div>
                                <AsyncButton title='Submit Query' onClick={onSubmit} tooltipPlacement={"left"} className={isQueryLoading ? 'is-loading' : ''} style={{border: 'none'}}>
                                    <IconButton>
                                        <SearchIcon></SearchIcon>
                                    </IconButton>
                                </AsyncButton>
                            </div>
                            <div>
                                <AsyncButton title='Reset Query' onClick={onClearQuery} tooltipPlacement={"left"} style={{border: 'none'}}>
                                    <IconButton onClick={onClearQuery}>
                                        <DeleteIcon></DeleteIcon>
                                    </IconButton>
                                </AsyncButton>
                            </div>
                        </div>
                </div>
            </Card>
        </div>
    )
};

const mapStateToProps = (state) => { return {
    query: state.get('queries').get('query'),
    isQueryLoading: state.get('general').get('loading').get('query-button')
}; }
  
export default connect(mapStateToProps)(QueryTimeline);
