import React from "react";

import { nanoid } from "nanoid";

import SearchBar from "./SearchBar";
import LifeEditor from "./LifeEditor";
import VisualQuerying from "./VisualQuerying";

import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/AssignmentInd';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import SettingsIcon from '@mui/icons-material/Settings';
import TrackProcessing from "./TrackProcessing";
import ConfigPane from "../containers/ConfigPane";

export const ModuleRoutes = [
    {
        title: "Search",
        icon: <SearchIcon fontSize="large"/>,
        route: "/search",
        component: <SearchBar/>,
        id: nanoid()
    },
    {
        title: "Track Processing",
        icon: <EditLocationIcon fontSize="large"/>,
        route: "/track-processing",
        component: <TrackProcessing/>,
        id: nanoid()
    },
    {
        title: "LIFE Editor",
        icon: <AssignmentIcon fontSize="large"/>,
        route: "/LIFE-editor",
        component: <LifeEditor/>,
        id: nanoid()
    },
    {
        title: "Visual Queries",
        icon: <ContactSupportIcon fontSize="large"/>,
        route: "/visual-queries",
        component: <VisualQuerying/>,
        id: nanoid()
    },
    {
        title: "Settings",
        icon: <SettingsIcon fontSize="large"/>,
        route: "/settings",
        component: <ConfigPane/>,
        id: nanoid()
    },
];