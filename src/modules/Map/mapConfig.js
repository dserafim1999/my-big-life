import React from "react";

import { TRACK_PROCESSING } from "../../constants";
import { getActiveRoute } from "../../utils"
import { getView } from "../ModuleRoutes"
import { createPointIcon, createMarker, createLocationMarker } from './utils';

import StopIcon from '@mui/icons-material/Stop';
import PlayIcon from '@mui/icons-material/PlayArrow';

import { renderToString } from 'react-dom/server';

// file used to set diferent map behaviour based on active route

export const getPolylineStyle = (color, display) => {
    const activeView = getView(getActiveRoute());

    switch (activeView) {
        case TRACK_PROCESSING:
            return {
                color,
                weight: 8,
                opacity: display ? 1 : 0
              };
        default:
            return {
                color,
                weight: 3,
                opacity: display ? 1 : 0
              };
    }
}

export const getSpecialMarkers = (pts, color) => {
    const activeView = getView(getActiveRoute());

    switch (activeView) {
        case TRACK_PROCESSING:
            return {
                start: createMarker(pts[0], createPointIcon(color, renderToString(<PlayIcon className='center' sx={{ fontSize: 16 }}/>))),
                end: createMarker(pts[pts.length - 1], createPointIcon(color, renderToString(<StopIcon className='center' sx={{ fontSize: 16 }}/>)))
              };
        default:
            // TODO refactor
            if (pts.length === 1) { // if only 1 point exists then it is a Location (derived from a Stay)
                return {
                    end: createLocationMarker(pts[0], "var(--secondary)")
                }
            } else { // no start/end markers
                return {}
            }
    }
}