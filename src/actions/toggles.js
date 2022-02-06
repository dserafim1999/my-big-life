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
  
export const toggleSegmentSpliting = (segmentId) => {
    return {
      segmentId,
      type: 'segment/toggle_split'
    }
}

export const toggleSegmentPointDetails = (segmentId) => {
  return {
    segmentId,
    type: 'segment/toggle_point_details'
  }
}

  
  
  