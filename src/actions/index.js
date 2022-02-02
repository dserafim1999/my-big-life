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
          pointEditing: false
        }
      }),
      name: file.name
    }
  }
}

export const toggleSegmentVisibility = (segmentId) => {
  return {
    segmentId,
    type: 'segment/visibility'
  }
}

export const toggleSegmentEditing = (segmentId) => {
  return {
    segmentId,
    type: 'segment/edit'
  }
}