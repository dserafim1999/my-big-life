import { 
  ADD_TRACK,
  ADD_MULTIPLE_TRACKS, 
  TOGGLE_TRACK_RENAMING,
  UPDATE_TRACK_NAME
} from ".";

import { Set } from 'immutable';
import { fitSegments } from './ui';

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

// converts track into GPX format
const trackToGPX = (segments) => {
  return segments.toJS().reduce((prev, s) => {
    return prev + s.points.reduce((prev, p) => {
      return prev + '<trkpt lat="' + p.lat + '" lon="' + p.lon + '">' +
      '<time>' + p.time.toISOString() + '</time>' +
      '</trkpt>'
    }, '<trkseg>') + '</trkseg>'
  }, '<?xml version="1.0" encoding="UTF-8"?><gpx xmlns="http://www.topografix.com/GPX/1/1"><trk>') + '</trk></gpx>'
}

// generates <a> tag to trigger file download
var saveData = (function () {
  let a = document.createElement('a');
  document.body.appendChild(a);
  a.style = 'display: none';
  return function (data, fileName) {
    let blob = new Blob([data], {type: 'octet/stream'});
    let url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}());

// triggers download with track converted to GPX format
export const downloadTrack = (segments, name) => {
  let str = trackToGPX(segments);
  saveData(str, name);
  return str;
}
