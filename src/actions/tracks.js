import { 
  ADD_TRACK, 
  TOGGLE_TRACK_REMAINING,
  UPDATE_TRACK_NAME
} from ".";

export const addTrack = (segments, file) => {
    return {
        segments,
        name: file.name,
        type: ADD_TRACK,
    }
}

export const toggleTrackRenaming = (trackId) => {
    return {
      trackId,
      type: TOGGLE_TRACK_REMAINING
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
