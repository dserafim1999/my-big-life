import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Card from "../../containers/Card";
import QueryStay from "./QueryStay";
import { addQueryStayAndRoute, addQueryStay, executeQuery, resetQuery, removeQueryStay, executeVisualQuery } from '../../actions/queries';
import { connect } from 'react-redux';

const QueryTimeline = ({ dispatch, query }) => {
    const timelineWidthPercentage = 7/8;
    const fullWidth = window.innerWidth * timelineWidthPercentage;
    const relativeOffset = window.innerWidth * (1 - timelineWidthPercentage);
    const height = 100;
    const stayWidth = 225;

    const timelineRef = useRef();
    
    const [id, setId] = useState(0);
    const [idToRemove, setIdToRemove] = useState(null);
    const [queryBlocks, setQueryBlocks] = useState([]);

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

    useEffect(() => {
        setQueryBlocks(queryBlocks.filter((x) => x.id !== idToRemove));
    },[idToRemove]);

    const onDoubleClick = (e) => {
        const startX = e.screenX - relativeOffset;
        const inBounds = startX >= 0 && startX <= timelineRef.current.offsetWidth - stayWidth;

        // TODO improve detection
        if (inBounds && e.target.className.includes("timeline")) {
            var stayId;

            if(query.size > 0) {
                const routeId = id;
                stayId = routeId + 1;
                
                dispatch(addQueryStayAndRoute(
                    {...defaultStay, id: stayId, x: startX},
                    {...defaultRoute, id: routeId},
                ));                
            } else {
                stayId = id;

                dispatch(addQueryStay({...defaultStay, id: stayId, x: startX}));
            }
            
            setId(stayId + 1);
            newQueryBlock(stayId, startX);
        }
    }

    const newQueryBlock = (stayId, startX) => {
        const block = {
            id: stayId,
            width: stayWidth,
            maxWidth: timelineRef.current.offsetWidth,
            maxHeight: height,
            queryState: {...defaultStay, id: stayId, x: startX},
            onRemove: onStayRemove
        };
        setQueryBlocks([...queryBlocks, block]);
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
        setQueryBlocks([]);
        dispatch(resetQuery());
    }

    const onStayRemove = (id) => {
        dispatch(removeQueryStay(id));
        setIdToRemove(id);
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
                        <div className='timeline' ref={timelineRef} style={{flexGrow: '1', height: '100%'}}>
                            {queryBlocks.map((block) => {
                                return <QueryStay key={block.id} {...block} />
                            })}
                        </div>
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
