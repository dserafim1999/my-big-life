/**
 * Returns the active route
 * 
 * @function
 * @returns Route
 */
export const getActiveRoute = () => {
    return window.location.pathname;
};

/**
 * Compares route with the active route
 * 
 * @function
 * @param {number} a Value
 * @param {number} b Another value
 * @Returns If values are equal
 */
export const isEquals = (a, b) => {
    return a === b;
}

export const max = (a, b) => a >= b ? a : b;
export const min = (a, b) => a <= b ? a : b;
export const clamp = (val, min, max) => val > max ? max : val < min ? min : val;

/**
 * Normalizes a number within a range.
 * 
 * @function
 * @param {number} m ∈ [rmin,rmax]: measurement to be scaled
 * @param {number} rmin minimum of the range
 * @param {number} rmax maximum of the range
 * @param {number} tmin minimum of the desired range 
 * @param {number} tmax maximum of the desired range 
 * @returns Normalized number
 */
export const normalize = (m, rmin, rmax, tmin, tmax) => {
    return (m - rmin) / (rmax - rmin) * (tmax - tmin) + tmin
}

/**
 * Groups object by a certain key
 * 
 * @param {object} xs object to group
 * @param {string} key Key to group by
 * @returns 
 */
export const groupBy = (xs, key) => {
  return xs.reduce(function(rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
}