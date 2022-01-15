import { GXParser } from 'gxparser';

// reads GPX file, converts to JSON format and then applies fn to the result 
export const loadFiles = (files, fn) => {
  for (var i=0; i<files.length; i++) {
    var file = files[i]
    var reader = new FileReader()
    reader.readAsText(file)
    reader.onloadend = function() {
      var gpx = GXParser(reader.result)
      fn(gpx)
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