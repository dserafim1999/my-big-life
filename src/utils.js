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