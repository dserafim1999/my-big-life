import { 
  ADD_TRACK,
  ADD_MULTIPLE_TRACKS, 
  TOGGLE_TRACK_RENAMING,
  UPDATE_TRACK_NAME,
  UPDATE_LIFE,
  REMOVE_TRACK,
  DISPLAY_CANONICAL_TRIPS,
  DISPLAY_CANONICAL_LOCATIONS,
  HIDE_CANONICAL,
  RESET_HISTORY
} from ".";

import { Set } from 'immutable';
import { fitSegments } from './ui';
import saveData from "./saveData";

import { toggleSegmentVisibility } from "./segments";

export const addTrack = (segments, name, locations = [], transModes = []) => {  
    return {
        segments,
        name,
        locations,
        transModes,
        type: ADD_TRACK,
    }
}

export const addMultipleTracks = (tracks, options) => {
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

export const displayCanonicalTrips = (trips) => ({
  trips,
  type: DISPLAY_CANONICAL_TRIPS
})

export const displayCanonicalLocations = (trips) => ({
  trips,
  type: DISPLAY_CANONICAL_LOCATIONS
})

export const hideCanonical = () => ({
  type: HIDE_CANONICAL
})

export const toggleTrackRenaming = (trackId) => {
    return {
      trackId,
      type: TOGGLE_TRACK_RENAMING
    }
  }

export const updateTrackName = (trackId, newName) => {
    return {
      trackId,
      name: newName,
      type: UPDATE_TRACK_NAME
    }
}

export const resetHistory = () => ({
  type: RESET_HISTORY
})

const MS_REG = /.[0-9]{3}Z$/;

// converts track into GPX format
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

// triggers download with track converted to GPX format
export const downloadTrack = (trackId) => {
  return (_, getState) => {
    let str = exportGPX(trackId, getState());
    saveData(str, getState().get('tracks').get('tracks').get(trackId).get('name'));
  }
}

export const downloadAll = () => {
  return (dispatch, getState) => {
    getState().get('tracks').get('tracks').keySeq().forEach((t) => {
      dispatch(downloadTrack(t));
    });
  }
}

export const showHideAll = () => {
  return (dispatch, getState) => {
    getState().get('tracks').get('segments').keySeq().forEach((seg) => {
      dispatch(toggleSegmentVisibility(seg));
    });
  }
}

export const removeTrack = (trackId) => ({
  trackId,
  type: REMOVE_TRACK
})

export const clearAll = () => {
  return (dispatch, getState) => {
    getState().get('tracks').get('tracks').keySeq().forEach((t) => {
      dispatch(removeTrack(t))
    });
  }
}

export const updateLIFE = (text, warning) => ({
  text,
  warning,
  type: UPDATE_LIFE
})