export const toggleTrackRenaming = (trackId) => {
  return {
    trackId,
    type: 'track/toggle_renaming'
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
  
export const toggleSegmentSpliting = (segmentId) => {
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

  
  
  