import { 
  ADD_TRACK,
  ADD_MULTIPLE_TRACKS, 
  UPDATE_TRACK_LIFE,
  REMOVE_TRACK,
  RESET_HISTORY,
  CLEAR_TRACKS
} from ".";

import { Set } from 'immutable';
import { fitSegments } from './map';
import { toggleSegmentVisibility } from "./segments";
import saveData from "../modules/TrackProcessing/saveData";

/**
 * Adds track to global state.
 * 
 * @action
 * @param {Array} segments Array with track's segments
 * @param {string} name Name of GPX file that contains track
 * @param {Array} locations Array with track's from and to location objects 
 * @returns Action Object
 */
export const addTrack = (segments, name, locations = []) => ({
    segments,
    name,
    locations,
    type: ADD_TRACK,
})

/**
 * Add multiple tracks to global state.
 * 
 * See `addTrack `.
 * 
 * @function
 * @param {Array} tracks Array with tracks 
 */
export const addMultipleTracks = (tracks) => {
  return (dispatch, getState) => {
    const getSegKeys = () => Set(getState().get('tracks').get('segments').keySeq());
    const previous = getSegKeys();
    dispatch({
      tracks,
      type: ADD_MULTIPLE_TRACKS
    });

    const diff = getSegKeys().subtract(previous);
    dispatch(fitSegments(...diff.toJS()));
  }
}

/**
 * Sets whether segments in a track are visible.
 * 
 * If no boolean value is set, value is toggled
 * 
 * @function
 * @param {number | string} trackId Track Id 
 * @param {boolean} value If track segments are visible. 
 */
export const toggleTrackSegmentsVisibility = (trackId, value) => {
  return (dispatch, getState) => {
    const segments = getState().get('tracks').get('tracks').get(trackId).get('segments').toJS();

    segments.map((id) => {
      dispatch(toggleSegmentVisibility(id, value));
    });
  }
}

/**
 * Highlight a segment in a track.
 * 
 * @function
 * @param {number | string} trackId Track Id 
 * @param {number} segmentId Segment Id 
 * @param {boolean} value If other track segments are highlighted 
 */
export const highlightSegmentInTrack = (trackId, segmentId, value) => {
  return (dispatch, getState) => {
    dispatch(toggleTrackSegmentsVisibility(trackId, !value));
    dispatch(toggleSegmentVisibility(segmentId, true));
  }
}

/**
 * Fully highlight a track.
 * 
 * @function
 * @param {number | string} trackId Track Id 
 * @param {boolean} value If track is highlighted  
 */
export const highlightTrack = (trackId, value) => {
  return (dispatch, getState) => {
    const tracks = getState().get('tracks').get('tracks').toJS();

    for (const [key, object] of Object.entries(tracks)) {
      if (key === trackId) {
        dispatch(toggleTrackSegmentsVisibility(key, true));
      } else {
        dispatch(toggleTrackSegmentsVisibility(key, value));
      }
    }
 }
}

/**
 * Reset history of changes to track
 * 
 * @returns Action Object
 */
export const resetHistory = () => ({
  type: RESET_HISTORY
})

const MS_REG = /.[0-9]{3}Z$/;

/**
 * Converts track into GPX format
 * 
 * @function
 * @param {number | string} trackId Track Id 
 * @param {object} state Global state
 * @returns GPX formatted string
 */
const exportGPX = (trackId, state) => {
  const segments = state.get('tracks').get('tracks').get(trackId).get('segments').toJS().map((segmentId, i) => {
    const segment = state.get('tracks').get('segments').get(segmentId);
    const identation = '\t'.repeat(3);
    const points = segment.get('points').map((point) => {
      return [
        identation,
        '<trkpt lat="' + point.get('lat') + '" lon="' + point.get('lon') + '">',
        '<time>' + point.get('time').toISOString().replace(MS_REG, 'Z') + '</time>',
        '</trkpt>'
      ].join('');
    }).toJS().join('\n');
    return '\t\t<trkseg>\n' + points + '\n\t\t</trkseg>';
  }).join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Generated by GatherMySteps: http://github.com/ruipgil/GatherMySteps -->',
    '<gpx xmlns="http://www.topografix.com/GPX/1/1">',
    '\t<trk>', segments, '\t</trk>',
    '</gpx>'
  ].join('\n');
}

/**
 * Triggers download with track converted to GPX format
 * 
 * @function
 * @param {number | string} trackId Track Id 
 */
export const downloadTrack = (trackId) => {
  return (_, getState) => {
    let str = exportGPX(trackId, getState());
    saveData(str, getState().get('tracks').get('tracks').get(trackId).get('name'));
  }
}

/**
 * Download all tracks edited in the Track Processing menu
 * 
 * @function 
 */
export const downloadAll = () => {
  return (dispatch, getState) => {
    getState().get('tracks').get('tracks').keySeq().forEach((t) => {
      dispatch(downloadTrack(t));
    });
  }
}

/**
 * Remove a track from the global state.
 * 
 * @action
 * @param {number | string} trackId Track Id 
 * @returns Action Object
 */
export const removeTrack = (trackId) => ({
  trackId,
  type: REMOVE_TRACK
})

/**
 * Remove all tracks/segments from state.
 * 
 * @action
 * @returns Action Object
 */
export const clearTracks = () => ({
  type: CLEAR_TRACKS
})

/**
 * Updates the LIFE representation of a track.
 * 
 * @action
 * @param {string} text Track LIFE representation 
 * @param {string} warning Warning message
 * @returns Action Object
 */
export const updateTrackLIFE = (text, warning) => ({
  text,
  warning,
  type: UPDATE_TRACK_LIFE
})
    