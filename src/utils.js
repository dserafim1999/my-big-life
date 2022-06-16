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

export const normalize = (m, rmin, rmax, tmin, tmax) => {
    /*
    rmin: minimum of the range
    rmax: maximum of the range
    tmin: minimum of the desired range
    tmax: maximum of the desired range
    m ∈ [rmin,rmax]: measurement to be scaled
    */
    return (m - rmin) / (rmax - rmin) * (tmax - tmin) + tmin
}
