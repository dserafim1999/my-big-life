export const extendSegment = (segmentId, index, lat, lon) => {
  return {
    segmentId,
    index,
    lat,
    lon,
    type: 'segment/extend'
  }
}

export const splitSegment = (segmentId, index) => {
  return {
      index,
      segmentId,
      type: 'segment/split'
  }
}

export const addSegmentPoint = (segmentId, index, lat, lon) => {
  return {
      segmentId,
      index,
      lat,
      lon,
      type: 'segment/add_point'
  }
}
export const removeSegmentPoint = (segmentId, index) => {
  return {
      segmentId,
      index,
      type: 'segment/remove_point'
  }
}
export const changeSegmentPoint = (segmentId, index, lat, lon) => {
  return {
      segmentId,
      index,
      lat,
      lon,
      type: 'segment/change_point'
  }
}

export const removeSegment = (segmentId) => {
  return {
      segmentId,
      type: 'segment/remove'
  }
}

export const joinSegment = (segmentId, index, details) => {
  return {
    index,
    segmentId,
    details,
    type: 'segment/join'
  }
}

export const fitSegment = (segmentId) => {
  return {
      segmentId,
      type: 'segment/fit'
  }
}

export const updateTimeFilterSegment = (segmentId, lower, upper) => {
  return {
    segmentId,
    lower,
    upper,
    type: 'segment/time_filter'
  }
}

export const toggleTimeFilter = (segmentId) => {
  return {
    segmentId,
    type: 'segment/toggle_time_filter'
  }
}

export const toggleSegmentVisibility = (segmentId) => {
    return {
      segmentId,
      type: 'segment/toggle_visibility'
    }
}
  
export const toggleSegmentEditing = (segmentId) => {
    return {
      segmentId,
      type: 'segment/toggle_edit'
    }
}
  
export const toggleSegmentSplitting = (segmentId) => {
    return {
      segmentId,
      type: 'segment/toggle_split'
    }
}

export const toggleSegmentJoining = (segmentId) => {
  return {
    segmentId,
    type: 'segment/toggle_join'
  }
}

export const toggleSegmentPointDetails = (segmentId) => {
  return {
    segmentId,
    type: 'segment/toggle_point_details'
  }
}

  
  
  