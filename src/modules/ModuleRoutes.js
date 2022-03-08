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
import { CONFIG_PANEL, LIFE_EDITOR, MAIN_VIEW, SEARCH_BAR, TRACK_PROCESSING, VISUAL_QUERIES } from "../constants";

export const ModuleRoutes = [
    {
        title: "Search",
        icon: <SearchIcon fontSize="large"/>,
        view: SEARCH_BAR,
        component: <SearchBar/>,
        id: nanoid()
    },
    {
        title: "Track Processing",
        icon: <EditLocationIcon fontSize="large"/>,
        view: TRACK_PROCESSING,
        component: <TrackProcessing/>,
        id: nanoid()
    },
    {
        title: "LIFE Editor",
        icon: <AssignmentIcon fontSize="large"/>,
        view: LIFE_EDITOR,
        component: <LifeEditor/>,
        id: nanoid()
    },
    {
        title: "Visual Queries",
        icon: <ContactSupportIcon fontSize="large"/>,
        view: VISUAL_QUERIES,
        component: <VisualQuerying/>,
        id: nanoid()
    },
    {
        title: "Settings",
        icon: <SettingsIcon fontSize="large"/>,
        view: CONFIG_PANEL,
        component: <ConfigPane/>,
        id: nanoid()
    },
];