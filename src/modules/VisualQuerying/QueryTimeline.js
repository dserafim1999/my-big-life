import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

import React, { useRef, useState } from "react";
import { connect } from 'react-redux';

import Card from "../../containers/Card";
import QueryStay from "./QueryStay";
import QueryRoute from './QueryRoute';

import { addQueryStayAndRoute, addQueryStay, executeQuery, resetQuery, removeQueryStay } from '../../actions/queries';
import AsyncButton from '../../components/Buttons/AsyncButton';


const QueryTimeline = ({ dispatch, query, isQueryLoading }) => {
    const timelineWidthPercentage = 7/8; // sets percentage of width card will occupy
    const fullWidth = window.innerWidth * timelineWidthPercentage;
    const relativeOffset = window.innerWidth * (1 - timelineWidthPercentage); // coords offset related to the percentage the Card's width will occupy on screen 
    const height = 100;
    const stayWidth = 225;

    const timelineRef = useRef();
    
    const [id, setId] = useState(0);

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
        const inBounds = startX <= maxX &&
            (lastStayX === undefined) ? 
                startX >= 0 :
                startX > lastStayX;

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
        //TODO remove id, x and y from what is sent
        dispatch(executeQuery(
                {
                    "data": [
                        {
                            "date": "--/--/----"
                        },
                        ...query.toArray()
                    ]
                }
            )
        );
    }

    const onClearQuery = () => {
        setId(0);
        dispatch(resetQuery());
    }

    const onStayRemove = (id) => {
        dispatch(removeQueryStay(id));
    }

    return (
        <div onDoubleClick={onDoubleClick} style={{width: "100%"}}>
            <Card 
                width={fullWidth} 
                height={height} 
                verticalOffset={2} 
                horizontalOffset={50} 
                isDraggable={false}
            >
                <div style={{width: '100%', height: '100%', display: 'flex'}}>
                        { displayTimeline() }
                        <div style={{borderLeft: '1px solid lightgrey'}}>
                            <div>
                                <AsyncButton title='Submit Query' onClick={onSubmit} tooltipPlacement={"left"} className={isQueryLoading ? 'is-loading' : ''} style={{border: 'none'}}>
                                    <IconButton onClick={onSubmit}>
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
