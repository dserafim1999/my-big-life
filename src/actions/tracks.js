import { 
  ADD_TRACK,
  ADD_MULTIPLE_TRACKS, 
  TOGGLE_TRACK_RENAMING,
  UPDATE_TRACK_NAME,
  UPDATE_LIFE,
  REMOVE_TRACK,
  RESET_HISTORY,
  DISPLAY_TRIPS,
  DISPLAY_LOCATIONS,
  CLEAR_ALL,
  DISPLAY_CANONICAL_TRIPS,
  CLEAR_TRIPS,
  TOGGLE_TRACK_INFO,
  CLEAR_LOCATIONS
} from ".";

import { Set } from 'immutable';
import { fitSegments, setAppLoading } from './general';
import saveData from "../modules/TrackProcessing/saveData";
import { toggleSegmentInfo, toggleSegmentVisibility } from "./segments";

export const addTrack = (segments, name, locations = []) => {  
    return {
        segments,
        name,
        locations,
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

export const displayTrips = (trips) => ({
  trips,
  type: DISPLAY_TRIPS
})

export const displayCanonicalTrips = (trips) => ({
  trips,
  type: DISPLAY_CANONICAL_TRIPS
})

export const displayLocations = (locations) => ({
  locations,
  type: DISPLAY_LOCATIONS
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

export const toggleTrackSegmentsVisibility = (trackId, value) => {
  return (dispatch, getState) => {
    const segments = getState().get('tracks').get('tracks').get(trackId).get('segments').toJS();

    segments.map((id) => {
      dispatch(toggleSegmentVisibility(id, value));
    });
  }
}

export const highlightSegmentInTrack = (trackId, segmentId, value) => {
  return (dispatch, getState) => {
    dispatch(toggleTrackSegmentsVisibility(trackId, !value));
    dispatch(toggleSegmentVisibility(segmentId, true));
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

export const removeTrack = (trackId) => ({
  trackId,
  type: REMOVE_TRACK
})

export const clearAll = () => ({
  type: CLEAR_ALL
})

export const clearTrips = () => {
  return (dispatch, getState) => {
    dispatch(toggleSegmentInfo(false));
    dispatch({type: CLEAR_TRIPS});
  }
}

export const clearLocations = () => ({
  type: CLEAR_LOCATIONS
})

export const updateLIFE = (text, warning) => ({
  text,
  warning,
  type: UPDATE_LIFE
})

export const loadTripsInBounds = (latMin, lonMin, latMax, lonMax, canonical) => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }

    dispatch(setAppLoading(true));

    const addr = getState().get('general').get('server');
    return fetch(addr + '/trips?latMin=' + latMin + '&lonMin=' + lonMin + '&latMax=' + latMax + '&lonMax=' + lonMax + '&canonical=' + canonical, options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((res) => {
        dispatch(clearTrips());
        dispatch(displayTrips(res.trips));
        dispatch(setAppLoading(false));
      });
  }
}

export const loadMoreTripsInBounds = (latMin, lonMin, latMax, lonMax, canonical) => {
  return (dispatch, getState) => {
    const options = {
      method: 'GET',
      mode: 'cors'
    }

    dispatch(setAppLoading(true));

    const addr = getState().get('general').get('server');
    return fetch(addr + '/moreTrips?latMin=' + latMin + '&lonMin=' + lonMin + '&latMax=' + latMax + '&lonMax=' + lonMax + '&canonical=' + canonical, options)
      .then((response) => response.json())
      .catch((e) => console.error(e))
      .then((res) => {
        dispatch(displayTrips(res.trips));
        dispatch(setAppLoading(false));
      });
  }
}