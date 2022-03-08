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
import { getActiveRoute } from "../utils";

export const getRoute = (view) => {
    const activeView = ModuleRoutes.find((module) => module.view === view);

    return activeView && activeView.route ? activeView.route : '/';
}

export const getView = (route) => {
    const module = ModuleRoutes.find((module) => module.route && (module.route === route));

    return module ? module.view : MAIN_VIEW;
}

export const getInitialView = () => {
    return getView(getActiveRoute());
}

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
        route: "/track-processing",
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
        route: "/visual-queries",
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