import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";

import React, { useRef, useState } from "react";
import { connect } from 'react-redux';

import Card from "../../containers/Card";
import QueryStay from "./QueryStay";
import QueryRoute from './QueryRoute';

import { addQueryStayAndRoute, addQueryStay, executeQuery, resetQuery, removeQueryStay, executeVisualQuery } from '../../actions/queries';


const QueryTimeline = ({ dispatch, query }) => {
    //TODO check if these still make sense
    const timelineWidthPercentage = 7/8;
    const fullWidth = window.innerWidth * timelineWidthPercentage;
    const relativeOffset = window.innerWidth * (1 - timelineWidthPercentage);
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
        const startX = e.screenX - relativeOffset;
        var lastStayX;
        
        lastStayX = query.size > 0 ? query.toJS().pop().queryBlock.x : undefined;

        // only creates stay if inside timeline bounds and if position is after last stay
        const inBounds = startX <= timelineRef.current.offsetWidth - stayWidth &&
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
                    dispatch: dispatch,
                    start: prevStayId.toString(), 
                    end: nextStayId.toString()
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

    /*const newQueryBlock = (stayId, queryState, routeId = null) => {
        const stayblock = {
            type: 'stay',
            id: stayId,
            width: stayWidth,
            maxWidth: timelineRef.current.offsetWidth,
            maxHeight: height,
            queryState: queryState,
            onRemove: onStayRemove
        };

        if (routeId !== null) {

            const prevStayId = (query.toJS()).pop().queryBlock.id;

            const routeBlock = {
                type: 'route',
                id: routeId,
                start: prevStayId.toString(), 
                end: stayId.toString()
            }
            setQueryBlocks([...queryBlocks, routeBlock, stayblock]);
        } else {
            setQueryBlocks([...queryBlocks, stayblock]);
        }
    }*/

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
                        <div style={{borderLeft:'grey 1px solid'}}>
                            <div>
                                <IconButton onClick={onSubmit}>
                                    <SearchIcon></SearchIcon>
                                </IconButton>
                            </div>
                            <div>
                                <IconButton onClick={onClearQuery}>
                                    <DeleteIcon></DeleteIcon>
                                </IconButton>
                            </div>
                        </div>
                </div>
            </Card>
        </div>
    )
};

const mapStateToProps = (state) => { return {
    query: state.get('queries').get('query')
}; }
  
export default connect(mapStateToProps)(QueryTimeline);
