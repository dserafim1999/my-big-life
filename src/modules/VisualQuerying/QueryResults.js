import React, { useEffect } from "react";
import { connect } from 'react-redux';

import Card from "../../containers/Card";
import QueryResult from "./QueryResult";

const QueryResults = ({ dispatch, results }) => {
    return (
        results.size > 0 &&
        (
            <Card width={700} height={450} style={{margin: '175px 25px'}} isDraggable={true}>
                <div style={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}>
                    {results.map((x) => {if (x !== undefined) return <QueryResult key={x.id} result={x}/>})}
                </div>
            </Card>
        )
    )
};

const mapStateToProps = (state) => { return {
    results: state.get('queries').get('results'),
}; }
  
export default connect(mapStateToProps)(QueryResults);
