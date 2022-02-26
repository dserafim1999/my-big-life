import {
    CENTER_MAP,
    UPDATE_BOUNDS,
    HIGHLIGHT_POINT,
    DEHIGHLIGHT_POINT,
    ADD_POINT_PROMPT,
    REMOVE_POINT_PROMPT,
    HIGHLIGHT_SEGMENT,
    DEHIGHLIGHT_SEGMENT
} from '.';

export const centerMap = (lat, lon) => ({
  lat,
  lon,
  type: CENTER_MAP
})

export const updateBounds = (bounds) => ({
  bounds,
  type: UPDATE_BOUNDS
})

export const highlightSegment = (segmentsIds) => ({
  segmentsIds,
  type: HIGHLIGHT_SEGMENT
})

export const dehighlightSegment = (segmentsIds) => ({
  segmentsIds,
  type: DEHIGHLIGHT_SEGMENT
})

export const highlightPoint = (points) => ({
  points,
  type: HIGHLIGHT_POINT
})

export const dehighlightPoint = (points) => ({
  points,
  type: DEHIGHLIGHT_POINT
})

export const addPointPrompt = (callback) => ({
  callback,
  type: ADD_POINT_PROMPT
})

export const removePointPrompt = () => ({
  type: REMOVE_POINT_PROMPT
})
