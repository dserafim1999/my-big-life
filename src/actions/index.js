export const COLORS = [
  '#f7403e', '#1f78b4', '#78de1d',
  '#33a02c', '#a6cee3', '#e31a1c',
  '#fdbf6f', '#ff7f00', '#cab2d6',
  '#6a3d9a', '#ffff99', '#b15928'
]
let _trackId = 0
let _segmentId = 0

export const addTrack = (track, file) => {
  let id = _trackId++
  return {
    type: 'track/add',
    track: {
      id,
      segments: track.map((segment) => {
        let sId = _segmentId++
        return {
          id: sId,
          points: segment,
          display: true,
          start: segment[0].time,
          end: segment[segment.length - 1].time,
          color: COLORS[sId % COLORS.length],
          name: '',
          editing: false,
          spliting: false
        }
      }),
      name: file.name
    }
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
  const sId = _segmentId++
  return {
    index,
    segmentId,
    segmentInfo: {
      id: sId,
      points: [],
      display: true,
      start: null,
      end: null,
      color: COLORS[sId % COLORS.length],
      name: '',
      editing: false,
      spliting: false
    },
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


export const fitSegment = (segmentId) => {
  return {
    segmentId,
    type: 'segment/fit'
  }
}

export const updateBounds = (bounds) => {
  return {
    bounds,
    type: 'ui/bounds'
  }
}

