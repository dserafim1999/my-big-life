import { IconButton } from "@mui/material";
import React from "react";
import { connect } from 'react-redux';
import AddCircleIcon from "@mui/icons-material/AddCircle";

import Card from "../../containers/Card";
import QueryResult from "./QueryResult";
import { loadMoreQueryResults } from "../../actions/queries";
import AsyncButton from "../../components/Buttons/AsyncButton";

const QueryResults = ({ dispatch, results, isLoadingMore, canLoadMore }) => {
    const onLoadMoreResults = () => {
        dispatch(loadMoreQueryResults());
    }

    console.log(canLoadMore, results)

    return (
        results.size > 0 &&
        (
            <Card width={700} height={450} style={{margin: '175px 25px'}} isDraggable={true}>
                <div style={{ flexGrow: 1, overflowY: 'scroll', height: '100%' }}>
                    {
                        results.map((x) => {if (x !== undefined) return <QueryResult key={x.id} result={x} dispatch={dispatch}/>})
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
            </Card>
        )
    )
};

const mapStateToProps = (state) => { return {
    results: state.get('queries').get('results'),
    canLoadMore: state.get('queries').get('canLoadMore'),
    isLoadingMore: state.get('general').get('loading').get('load-more-button')
}; }
  
export default connect(mapStateToProps)(QueryResults);
