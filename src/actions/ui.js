export const updateBounds = (bounds) => {
    return {
      bounds,
      type: 'ui/bounds'
    }
}

export const hideDetails = () => {
  return {
    type: 'ui/hide_track_details'
  }
}
export const showDetails = () => {
  return {
    type: 'ui/show_track_details'
  }
}