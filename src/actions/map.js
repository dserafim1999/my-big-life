import {
    CENTER_MAP,
    UPDATE_BOUNDS,
    HIGHLIGHT_POINT,
    DEHIGHLIGHT_POINT,
    ADD_POINT_PROMPT,
    REMOVE_POINT_PROMPT,
    HIGHLIGHT_SEGMENT,
    DEHIGHLIGHT_SEGMENT,
    SELECT_POINT_ON_MAP,
    DESELECT_POINT_ON_MAP
} from '.';
import { BoundsRecord } from '../records';

/**
 * Adjusts map bounds to fit segment
 * 
 * @function
 * @param {number} segmentId Segment id
 */
 export const fitSegment = (segmentId) => {
  return (dispatch, getState) => {
    var bounds = getState().get('tracks').get('segments').get(segmentId).get('bounds');
    bounds = bounds.scale(1.1);
    dispatch(updateBounds(bounds));
  }
}

/** 
 * Adjusts map bounds to fit segments
 * 
 * @function
 * @param {Array} segmentIds Array with ids of segments to fit 
 */
 export const fitSegments = (...segmentIds) => {
  return (dispatch, getState) => {
    const ss = getState().get('tracks').get('segments');
    const bounds = segmentIds.reduce((prev, segId) => {
      const segmentBounds = ss.get(segId).get('bounds');
      return prev.updateWithBounds(segmentBounds);
    }, new BoundsRecord());

    dispatch(updateBounds(bounds.scale(1.1)));
  }
}

/**
 * Adjusts map bounds to fit tracks
 * 
 * @function
 * @param {Array} trackIds Array with ids of tracks to fit 
 */
 export const fitTracks = (...trackIds) => {
  return (dispatch, getState) => {
    const tracks = getState().get('tracks').get('tracks');
    const segments = getState().get('tracks').get('segments');
    const bounds = trackIds.reduce((prev, trackId) => {
      const trackSegments = tracks.get(trackId).get('segments');
      return trackSegments.reduce((pr, segmentId) => {
        const segmentBounds = segments.get(segmentId).get('bounds');
        return pr.updateWithBounds(segmentBounds);
      }, prev);
    }, new BoundsRecord());

    dispatch(updateBounds(bounds));
  }
}

/**
 * Highlights segment point on map.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @param {object} highlightedPoint Segment point to highlight
 * @param {function} onClick Behaviour when point is clicked 
 * @returns Action Object
 */
 export const selectPointOnMap = (segmentId, highlightedPoint, onClick) => ({
  onClick,
  segmentId,
  highlightedPoint,
  type: SELECT_POINT_ON_MAP
})

/**
 * Deselects selected segment point on map.
 * 
 * @action
 * @param {number} segmentId Segment Id 
 * @returns Action Object
 */
export const deselectPointOnMap = (segmentId) => ({
  segmentId,
  type: DESELECT_POINT_ON_MAP
})

/**
 * Sets the map position as the provided point
 * 
 * @action
 * @param {number} lat Center latitude
 * @param {number} lon Center longitude
 * @returns Action Object
 */
export const centerMap = (lat, lon) => ({
  lat,
  lon,
  type: CENTER_MAP
})

/**
 * Updates map bounds
 * 
 * @param {BoundsRecord} bounds 
 * @returns Action Object
 */
export const updateBounds = (bounds) => ({
  bounds,
  type: UPDATE_BOUNDS
})

/**
 * Sets segments that will be highlighted (remaining will be hidden)
 * 
 * @action
 * @param {Array} segmentsIds Segments to highlight 
 * @returns Action Object
 */
export const highlightSegment = (segmentsIds) => ({
  segmentsIds,
  type: HIGHLIGHT_SEGMENT
})

/**
 * Removes segments that will no longer be highlighted
 * 
 * @action
 * @param {Array} segmentsIds Segments to dehighlight 
 * @returns Action Object
 */
export const dehighlightSegment = (segmentsIds) => ({
  segmentsIds,
  type: DEHIGHLIGHT_SEGMENT
})

/**
 * Sets points that will be highlighted (remaining will be hidden)
 * 
 * @action
 * @param {Array} points Points to highlight 
 * @returns Action Object
 */
export const highlightPoint = (points) => ({
  points,
  type: HIGHLIGHT_POINT
})

/**
 * Removes points that will no longer be highlighted
 * 
 * @action
 * @param {Array} points Points to dehighlight 
 * @returns Action Object
 */
export const dehighlightPoint = (points) => ({
  points,
  type: DEHIGHLIGHT_POINT
})

/**
 * Adds callback function state that will be called when a new point is added to the map by the user
 * 
 * @action
 * @param {function} callback Callback function
 * @returns Action Object
 */
export const addPointPrompt = (callback) => ({
  callback,
  type: ADD_POINT_PROMPT
})

/**
 * Removes callback function set in state for new point to be added by user
 * 
 * @action
 * @returns Action Object
 */
export const removePointPrompt = () => ({
  type: REMOVE_POINT_PROMPT
})
