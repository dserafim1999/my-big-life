import { IconButton } from "@mui/material";
import React, { useState } from "react";
import { connect } from 'react-redux';
import AddCircleIcon from "@mui/icons-material/AddCircle";

import Card from "../../containers/Card";
import QueryResult from "./QueryResult";
import { loadMoreQueryResults } from "../../actions/queries";
import AsyncButton from "../../components/Buttons/AsyncButton";

const panelOpenStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "100%",
    width: "15px",
    height: "50px",
    borderRadius: "0 10px 10px 0",
    cursor: "pointer",
    backgroundColor: "white",
    display: "flex",
    alignItems: "center",
    color: "grey"
}

const QueryResults = ({ dispatch, results, isLoadingMore, canLoadMore }) => {
    const [panelOpen, setIsPanelOpen] = useState(true);

    const onLoadMoreResults = () => {
        dispatch(loadMoreQueryResults());
    }

    const togglePanelButton = () => {
        return (
            <div onClick={() => setIsPanelOpen(!panelOpen)} style={panelOpenStyle}>{ panelOpen ? "<" : ">"}</div>
        )
    }

    if (results.size <= 0) return null;

    return (
            <Card width={panelOpen ? 700 : 5} height={450} containerStyle={{margin: '175px 25px'}} isDraggable={true}>
                { togglePanelButton() }
                { panelOpen && 
                    (
                        <div style={{ flexGrow: 1, overflowY: 'scroll', height: '100%' }}>
                            {
                                results.map((x) => {if (x !== undefined) return <QueryResult key={x.id} result={x} querySize={x.querySize} dispatch={dispatch}/>})
                            }
                            { canLoadMore &&
                                (<div style={{width: "100%", height: "75px", textAlign:"center"}}>
                                    <AsyncButton title='Load More Results' className={isLoadingMore ? 'is-loading' : ''} style={{border: "none", position: "relative", top: "50%", transform: "translateY(-50%)"}}>
                                        <IconButton onClick={onLoadMoreResults} >
                                            <AddCircleIcon fontSize="large"/>
                                        </IconButton>
                                    </AsyncButton>
                                </div>)
                            }
                        </div>
                    )
                }
            </Card>
    )
};

const mapStateToProps = (state) => { return {
    results: state.get('queries').get('results'),
    canLoadMore: state.get('queries').get('canLoadMore'),
    isLoadingMore: state.get('general').get('loading').get('load-more-button')
}; }
  
export default connect(mapStateToProps)(QueryResults);
