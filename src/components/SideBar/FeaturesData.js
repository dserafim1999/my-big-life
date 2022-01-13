import React from "react";

import {nanoid } from "nanoid";

import SearchBar from "../SearchBar";
import LifeEditor from "../LifeEditor";
import TrackProcessing from "../TrackProcessing";
import VisualQuerying from "../VisualQuerying";

import SearchIcon from '@mui/icons-material/Search';
import AssignmentIcon from '@mui/icons-material/AssignmentInd';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

export const FeaturesData = [
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
        route: "/life-editor",
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
];