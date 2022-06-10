import React, { useEffect } from "react";
import { connect } from 'react-redux';

import Card from "../../containers/Card";
import QueryResult from "./QueryResult";

const QueryResults = ({ dispatch, results }) => {
    return (
        results.size > 0 &&
        (
            <Card width={450} height={450} style={{margin: '175px 25px'}}>
                <div style={{ flexGrow: 1, overflowY: 'auto', height: '100%' }}>
                    {results.map((x) => {if (x !== undefined) return <QueryResult result={x.data}/>})}
                </div>
            </Card>
        )
    )
};

const mapStateToProps = (state) => { return {
    results: state.get('queries').get('results'),
}; }
  
export default connect(mapStateToProps)(QueryResults);
