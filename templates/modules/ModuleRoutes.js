import React from "react";

import { nanoid } from "nanoid";
import { EXAMPLE_MODULE_VIEW } from "../constants";

import ExampleModule from "./ExampleModule";
import Icon from '@mui/icons-material/Camera'; // Just an example

// Should be appended to the already existing ModuleRoutes
export const ModuleRoutes = [
    {
        title: "Example",
        view: EXAMPLE_MODULE_VIEW,
        icon: <Icon fontSize="large"/>,
        component: <ExampleModule/>,
        id: nanoid()
    }
];