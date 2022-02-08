import haversine from 'haversine';

// returns the active route
export const getActiveRoute = () => {
    return window.location.pathname;
  };

// compares route with the active route
export const isEquals = (a, b) => {
    return a === b;
}

export const calculateMetrics = (points) => {
  const convert = 1 / 3600000;
  return points.map((p) => {
    return { latitude: p.lat, longitude: p.lon, time: p.time }
  }).map((curr, i, arr) => {
    if (i !== 0) {
      let prev = arr[i - 1];
      let distance = haversine(prev, curr, {unit: 'km'});
      let timeDiff = curr.time.diff(prev.time) * convert;
      let velocity = timeDiff === 0 ? 0 : distance / timeDiff;
      return {
        distance,
        velocity,
        lat: curr.lat,
        lon: curr.lon,
        time: curr.time
      }
    } else {
      return {
        distance: 0,
        velocity: 0,
        lat: curr.lat,
        lon: curr.lon,
        time: curr.time
      }
    }
  });
}

export const calculateDistance = (points) => {
  let l = points.count() - 2;
  return points.map((p) => {
    return { latitude: p.lat, longitude: p.lon }
  }).reduce((prev, curr, i, arr) => {
    if (i < l) {
      return prev + haversine(curr, arr[i + 1], {unit: 'km'})
    } else {
      return prev;
    }
  }, 0);
}

export const max = (a, b) => a >= b ? a : b;
export const min = (a, b) => a <= b ? a : b;