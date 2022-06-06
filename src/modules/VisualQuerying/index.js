import React from "react";

import QueryForm from "./QueryForm"
import QueryResults from "./QueryResults";
import QueryTimeline from "./QueryTimeline"

const VisualQuerying = () => {
    return (
        <>
            <QueryTimeline/>
            {/*<QueryForm/>*/}
            <QueryResults/>
        </>
    )
};

export default VisualQuerying;