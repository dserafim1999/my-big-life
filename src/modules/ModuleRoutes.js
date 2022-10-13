import React from "react";

import { nanoid } from "nanoid";
import { CONFIG_PANEL, MAIN_VIEW, SEARCH, TRACK_PROCESSING, VISUAL_QUERIES } from "../constants";
import { getActiveRoute } from "../utils";

import Search from "./Search";
import VisualQuerying from "./VisualQuerying";
import TrackProcessing from "./TrackProcessing";
import Settings from "./Settings";
import MainView from "./MainView";

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import TrackProcessingIcon from '@mui/icons-material/EditLocationAlt';
import VisualQueriesIcon from '@mui/icons-material/NotListedLocation';
import SettingsIcon from '@mui/icons-material/Settings';

export const getRoute = (view) => {
    const activeView = ModuleRoutes.find((module) => module.view === view);

    return activeView && activeView.route ? activeView.route : '/';
}

export const getView = (route) => {
    const module = ModuleRoutes.find((module) => module.route && (module.route === route));

    return module ? module.view : MAIN_VIEW;
}

export const getActiveView = () => {
    return getView(getActiveRoute());
}

// Add a new view to the navigation menu
export const ModuleRoutes = [
    {
        title: "Home",
        view: MAIN_VIEW,
        icon: <HomeIcon fontSize="large"/>,
        component: <MainView/>,
        id: nanoid()
    },
    {
        title: "Search",
        icon: <SearchIcon fontSize="large"/>,
        route: "/search",
        view: SEARCH,
        component: <Search/>,
        id: nanoid()
    },
    {
        title: "Track Processing",
        icon: <TrackProcessingIcon fontSize="large"/>,
        route: "/track-processing",
        view: TRACK_PROCESSING,
        component: <TrackProcessing/>,
        id: nanoid()
    },
    {
        title: "Visual Queries",
        icon: <VisualQueriesIcon fontSize="large"/>,
        route: "/visual-queries",
        view: VISUAL_QUERIES,
        component: <VisualQuerying/>,
        id: nanoid()
    },
    {
        title: "Settings",
        icon: <SettingsIcon fontSize="large"/>,
        route: "/settings",
        view: CONFIG_PANEL,
        component: <Settings/>,
        id: nanoid()
    },
];