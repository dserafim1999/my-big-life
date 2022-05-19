import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import TempIcon from '@mui/icons-material/Adjust';
import { IconButton } from "@mui/material";
import React, { useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";

import Card from "../../containers/Card";
import QueryStay from "./QueryStay";
import { executeQuery } from '../../actions/queries';
import { connect } from 'react-redux';

const QueryTimeline = ({ dispatch }) => {
    const timelineWidthPercentage = 7/8;
    const fullWidth = window.innerWidth * timelineWidthPercentage;
    const relativeOffset = window.innerWidth * (1 - timelineWidthPercentage);
    const height = 100;
    const stayWidth = 200;

    const timelineRef = useRef();
    
    const [id, setId] = useState(0);
    const [queryBlocks, setQueryBlocks] = useState([]);
    const [queryState, setQueryState] = useState([]);

    const defaultRoute = {
        "route":"",
        "duration":"duration",
        "start": "--:--",
        "end": "--:--",
        "temporalStartRange":"0min",
        "temporalEndRange":"0min"
    };

    const getId = () => {
        var _id = id;
        setId(_id + 1);
        return _id;
    }

    const updateQueryState = (id, state) => {
        const index = queryBlocks.findIndex((x) => x.id === id);

        if (index !== -1) {
            queryBlocks[index] = state;
            setQueryBlocks(queryBlocks);
        }
    }

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
            var block = {
                id: getId(),
                startX: startX,
                width: stayWidth,
                maxWidth: timelineRef.current.offsetWidth,
                maxHeight: height,
                onChange: (id, state) => updateQueryState(id, state)
            };
            setQueryBlocks([...queryBlocks, block]);
        }
        
        // TEST
        // if (queryState.length >= 1) {

        //     const lastStay = queryState[queryState.length - 1];

        //     const queryTail = connectStayWithRoute(
        //         lastStay, 
        //         defaultRoute, 
        //         {
        //             "location":"local",
        //             "start": "00:00",
        //             "end": "23:59",
        //             "spatialRange":"0m",
        //             "temporalStartRange":"0min",
        //             "temporalEndRange":"0min",
        //             "duration":"duration"
        //         })
            
        //     queryState.push(...queryTail)
        //     setQueryState(queryState);
        // } else {
        //     setQueryState([...queryState, {
        //         "location":"local",
        //         "start": "04:04",
        //         "end": "05:05",
        //         "spatialRange":"0m",
        //         "temporalStartRange":"0min",
        //         "temporalEndRange":"0min",
        //         "duration":"duration"
        //     }]);
        // }
    }

    const onSubmit = () => {
        console.log(queryState)
    }

    const onDelete = () => {
        setId(0);
        setQueryBlocks([]);
        setQueryState([]);
    }

    const onStayRemove = (id) => {
        if(id % 2 == 0) { //stays always have pair index
            if (id === 0) {
                if (queryState.length == 0) {
                    queryState.splice(id, 1);
                } else {
                    queryState.splice(id, 2); //removes first route associated to first stay
                }
            } else if (id === queryState.length - 1){
                queryState.splice(id - 1, 2); //removes last route and stay from end
            } else { //reconnects stays deleted one was inbetween of 
                const queryTail = connectStayWithRoute(
                    queryState[id - 2],
                    defaultRoute,
                    queryState[id + 2]);
                queryState.splice(id - 1, 4, ...queryTail);
            }

            setQueryState(queryState);
        } else {
            console.error("not a stay")
        }
        
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
                <Container>
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

const mapStateToProps = (state) => { return {}; }
  
export default connect(mapStateToProps)(QueryTimeline);
