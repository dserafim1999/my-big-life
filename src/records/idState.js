/**
 * Keeps state for track and segment id generations
 */

let _trackId = 0;
let _segmentId = 0;

export const reset = () => {
  _trackId = 0
  _segmentId = 0
}

export const generateTrackId = () => {
  return _trackId++;
}

export const getTrackId = () => {
  return _trackId;
}

export const generateSegmentId = () => {
  return _segmentId++;
}

export const getSegmentId = () => {
  return _segmentId;
}