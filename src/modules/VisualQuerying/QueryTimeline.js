import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import TempIcon from '@mui/icons-material/Adjust';
import { IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Card from "../../containers/Card";
import QueryStay from "./QueryStay";
import { addQueryStayAndRoute, addQueryStay, executeQuery, resetQuery } from '../../actions/queries';
import { connect } from 'react-redux';

const QueryTimeline = ({ dispatch, query }) => {
    const timelineWidthPercentage = 7/8;
    const fullWidth = window.innerWidth * timelineWidthPercentage;
    const relativeOffset = window.innerWidth * (1 - timelineWidthPercentage);
    const height = 100;
    const stayWidth = 225;

    const timelineRef = useRef();
    
    const [id, setId] = useState(0);
    const [queryBlocks, setQueryBlocks] = useState([]);

    const defaultRoute = {
        "route":"",
        "duration":"duration",
        "start": "--:--",
        "end": "--:--",
        "temporalStartRange":"0min",
        "temporalEndRange":"0min"
    };

    const defaultStay = {
        location: 'local',
        spatialRange: '0m',
        start: '--:--',
        end: '--:--',
        duration: "duration",
        temporalEndRange: "0min",
        temporalStartRange: "0min"
    };

    const connectStayWithRoute = (stay1, route, stay2) => {
        route.start = stay1.end;
        route.end = stay2.start;

        return [route, stay2];        
    }

    const onDoubleClick = (e) => {
        const startX = e.screenX - relativeOffset;
        const inBounds = startX >= 0 && startX <= timelineRef.current.offsetWidth - stayWidth;

        // TODO improve detection
        if (inBounds && e.target.className.includes("timeline")) {
            var stayId;

            if(query.size > 0) {
                const routeId = id;
                stayId = routeId + 1;
                
                dispatch(addQueryStayAndRoute(defaultStay, stayId, defaultRoute, routeId));                
            } else {
                stayId = id;

                dispatch(addQueryStay(defaultStay, stayId));
            }
            
            setId(stayId + 1);
            newQueryBlock(stayId, startX);
        }
    }

    const newQueryBlock = (stayId, startX) => {
        const block = {
            id: stayId,
            startX: startX,
            width: stayWidth,
            maxWidth: timelineRef.current.offsetWidth,
            maxHeight: height,
            queryState: defaultStay,
        };
        setQueryBlocks([...queryBlocks, block]);
    }

    const onSubmit = () => {
        dispatch(executeQuery(
            {
                "data": [
                    {
                        "date": "--/--/----"
                    },
                    ...query.toArray()
                ]
            })
        );
    }

    const onDelete = () => {
        setId(0);
        setQueryBlocks([]);
        dispatch(resetQuery());
    }

    // const onStayRemove = (id) => {
    //     //TODO fix
    //     if(id % 2 == 0) { //stays always have pair index
    //         if (id === 0) {
    //             if (queryState.length == 0) {
    //                 queryState.splice(id, 1);
    //             } else {
    //                 queryState.splice(id, 2); //removes first route associated to first stay
    //             }
    //         } else if (id === queryState.length - 1){
    //             queryState.splice(id - 1, 2); //removes last route and stay from end
    //         } else { //reconnects stays deleted one was inbetween of 
    //             const queryTail = connectStayWithRoute(
    //                 queryState[id - 2],
    //                 defaultRoute,
    //                 queryState[id + 2]);
    //             queryState.splice(id - 1, 4, ...queryTail);
    //         }

    //         setQueryState(queryState);
    //     } else {
    //         console.error("not a stay")
    //     }
        
    // }

    return (
        <div onDoubleClick={onDoubleClick} style={{width: "100%"}}>
            <Card 
                width={fullWidth} 
                height={height} 
                verticalOffset={2} 
                horizontalOffset={50} 
                isDraggable={false}
            >
                <Container style={{height: "100%"}}>
                    <Row>
                        <Col sm={11} className='timeline' ref={timelineRef}>
                            {queryBlocks.map((block, i) => {
                                return <QueryStay key={i} {...block}/>
                            })}
                        </Col>
                        <Col sm={1} style={{borderLeft: '1px solid grey'}}>
                            <Row>
                                <div>
                                    <IconButton onClick={onSubmit}>
                                        <SearchIcon></SearchIcon>
                                    </IconButton>
                                </div>
                            </Row>
                            <Row>
                                <div>
                                    <IconButton onClick={onDelete}>
                                        <DeleteIcon></DeleteIcon>
                                    </IconButton>
                                </div>
                            </Row>
                            {/* <Row>
                                <div>
                                    <IconButton onClick={onStayRemove(2)}>
                                        <TempIcon></TempIcon>
                                    </IconButton>
                                </div>
                            </Row> */}
                        </Col>
                    </Row>
                </Container>
            </Card>
        </div>
    )
};

const mapStateToProps = (state) => { return {
    query: state.get('queries').get('query')
}; }
  
export default connect(mapStateToProps)(QueryTimeline);
