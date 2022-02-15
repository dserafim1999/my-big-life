import { 
  HIDE_TRACK_DETAILS,
  SHOW_TRACK_DETAILS,
  UPDATE_BOUNDS,
  UPDATE_INTERNAL_BOUNDS,
  ADD_ALERT,
  REMOVE_ALERT
} from "."

export const updateBounds = (bounds) => {
    return {
      bounds,
      type: UPDATE_BOUNDS
    }
}

export const hideDetails = () => {
  return {
    type: HIDE_TRACK_DETAILS
  }
}
export const showDetails = () => {
  return {
    type: SHOW_TRACK_DETAILS
  }
}

export const updateInternalBounds = (bounds) => {
  return {
    bounds,
    type: UPDATE_INTERNAL_BOUNDS
  }
}

export const addAlert = (message, type = 'error') => {
  return {
    message,
    alertType: type,
    type: ADD_ALERT
  }
}

export const removeAlert = (alert) => {
  return {
    alert,
    type: REMOVE_ALERT
  }
}