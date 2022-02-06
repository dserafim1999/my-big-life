import colors from "./colors";
import { generateSegmentId, generateTrackId } from "./idState"

export const addTrack = (track, file) => {
    let id = generateTrackId();
    return {
        type: 'track/add',
        track: {
        id,
        segments: track.map((segment) => {
            let sId = generateSegmentId();
            return {
                id: sId,
                points: segment,
                display: true,
                start: segment[0].time,
                end: segment[segment.length - 1].time,
                color: colors(sId),
                name: '',
                editing: false,
                spliting: false,
                joining: false,
                pointDetails: false
            }
        }),
        name: file.name
        }
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
    const sId = generateSegmentId();
    return {
        index,
        segmentId,
        segmentInfo: {
        id: sId,
        points: [],
        display: true,
        start: null,
        end: null,
        color: colors(sId),
        name: '',
        editing: false,
        spliting: false,
        joining: false,
        pointDetails: false
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