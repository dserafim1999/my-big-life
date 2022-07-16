import React from "react";
import { connect } from "react-redux";

import QueryResults from "./QueryResults";
import QueryTimeline from "./QueryTimeline"

const VisualQuerying = ({isVisible}) => {
    if (!isVisible) return null;

    return (
        <>
            <QueryTimeline/>
            <QueryResults/>
        </>
    )
};

const mapStateToProps = (state) => {
    return {
        isVisible: state.get('general').get('isUIVisible')
    };
}
  
export default connect(mapStateToProps)(VisualQuerying);