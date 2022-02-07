export const addTrack = (segments, file) => {
    return {
        segments,
        name: file.name,
        type: 'track/add',
    }
}

export const toggleTrackRenaming = (trackId) => {
    return {
      trackId,
      type: 'track/toggle_renaming'
    }
  }

export const updateTrackName = (trackId, newName) => {
    return {
      trackId,
      name: newName,
      type: 'track/update_name'
    }
}

// converts track into GPX format
const trackToGPX = (track) => {
  return track.segments.reduce((prev, s) => {
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
export const downloadTrack = (track) => {
  let str = trackToGPX(track);
  saveData(str, track.name);
  return str;
}
