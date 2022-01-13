// returns the active route
export const getActiveRoute = () => {
    return window.location.pathname;
  };

// compares route with the active route
export const isEquals = (a, b) => {
    return a === b;
}