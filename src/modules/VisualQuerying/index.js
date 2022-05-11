import React from "react";

import Card from "../../containers/Card";
import QueryForm from "./QueryForm"

const VisualQuerying = () => {
    return (
        <Card width={275} verticalOffset={1} horizontalOffset={1}>
            <QueryForm></QueryForm>
        </Card>
    )
};

export default VisualQuerying;