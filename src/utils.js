import { GXParser } from 'gxparser';
import moment from 'moment';

// reads GPX file, converts to JSON format and then applies fn to the result 
export const loadFiles = (files, fn) => {
  for (let i = 0; i < files.length; i++) {
    let file = files[i];
    /*global FileReader*/
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onloadend = () => {
      let gpx = GXParser(reader.result);
      gpx.trk = gpx.trk.map((track) => {
        return {
          trkseg: track.trkseg.map((segment) => {
            return {
              trkpt: segment.trkpt.map((point) => {
                return {
                  lat: Number(point.lat),
                  lon: Number(point.lon),
                  time: moment(point.time[0])
                }
              })
            }
          })
        }
      })
      fn(gpx, file);
    }
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
}())

// triggers download with track converted to GPX format
export const downloadTrack = (track) => {
  let str = trackToGPX(track);
  saveData(str, track.name);
  return str;
}


// returns the active route
export const getActiveRoute = () => {
    return window.location.pathname;
  };

// compares route with the active route
export const isEquals = (a, b) => {
    return a === b;
}

export const max = (a, b) => a >= b ? a : b;
export const min = (a, b) => a <= b ? a : b;