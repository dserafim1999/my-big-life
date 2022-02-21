import { GXParser } from 'gxparser';
import moment from 'moment';
import { map } from 'async';

// reads GPX file, converts to JSON format and then applies fn to the result 
export const loadFiles = (files, fn) => {
  map(files, (file, done) => {
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
      done(null, { gpx, name: file.name })
    }
  }, (_, result) => fn(result))
}