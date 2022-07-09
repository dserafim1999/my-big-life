import React from "react";

import { nanoid } from "nanoid";

import Search from "./Search";
import VisualQuerying from "./VisualQuerying";

import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import SettingsIcon from '@mui/icons-material/Settings';
import TrackProcessing from "./TrackProcessing";
import ConfigPane from "../containers/ConfigPane";
import { CONFIG_PANEL, MAIN_VIEW, SEARCH, TRACK_PROCESSING, VISUAL_QUERIES } from "../constants";
import { getActiveRoute } from "../utils";
import MainView from "./MainView";

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
        icon: <EditLocationIcon fontSize="large"/>,
        route: "/track-processing",
        view: TRACK_PROCESSING,
        component: <TrackProcessing/>,
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
        route: "/settings",
        view: CONFIG_PANEL,
        component: <ConfigPane/>,
        id: nanoid()
    },
];