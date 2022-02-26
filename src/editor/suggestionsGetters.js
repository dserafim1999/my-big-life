import {
  updateLocationName,
  updateTransportationMode,
  selectPointInMap,
  deselectPointInMap,
  getTransportationModesFor
} from '../actions/segments';

import {
  getLocationSuggestion
} from '../actions/progress';

const filterSuggestions = (text, suggestions) => {
  let filtered = suggestions.filter((s) => s.match(text));
  filtered = filtered.filter((s) => s.toLowerCase() !== text.toLowerCase());
  filtered = filtered.length === 0 ? suggestions : filtered;
  filtered = filtered.filter((s) => s.toLowerCase() !== text.toLowerCase());
  return filtered;
}

const createPlaceSuggestions = (index) => (
  {
    type: 'TEXT',
    getter: (text, data, callback) => {
      const { dispatch, references } = data;
      const refs = references.point ? references : (references.from || references.to);
      if (refs && refs.point) {
        dispatch(getLocationSuggestion(refs.point))
          .then((response) => callback(filterSuggestions(data.value, response)));
      }
      // getLocationSuggestion(references)
      // const from = data.segment.get('locations').get(index)
      // if (from) {
      //   return callback(filterSuggestions(data.value, from.get('other').map((l) => l.get('label')).toJS()))
      // } else {
      //   return callback([])
      // }
    },
    setter: (text, data) => {
      const { dispatch, segment } = data;
      // dispatch(updateLocationName(segment.get('id'), text, !index))
    }
  }
)

export default {
  'Time': {
    type: 'DYNAMIC',
    getter: (text, data, callback) => {
    },
    setter: (text, data) => {},
    disposer: (data) => {
    }
  },
  'Location': createPlaceSuggestions(1),
  'LocationTo': createPlaceSuggestions(1),
  'LocationFrom': createPlaceSuggestions(0),
  'Tag': {
    type: 'TEXT',
    getter: (text, data, callback) => {
      const { dispatch, references } = data;
      if (references) {
        const { segmentId, index } = references.from;
        const list = dispatch(getTransportationModesFor(segmentId, index));
        const filtered = filterSuggestions(text, list);
        return callback(filtered);
      }
      // const tmode = data.segment.get('transportationModes').get(data.modeId)
      // const MODES = {
      //   '0': 'Stop',
      //   '1': 'Foot',
      //   '2': 'Vehicle'
      // }
      // if (tmode) {
      //   const list = tmode.get('classification').entrySeq().sort((a, b) => (a[1] < b[1])).map((v) => MODES[v[0]]).toJS()
      //   return callback(filterSuggestions(data.value, list))
      // } else {
      //   return []
      // }
    },
    setter: (text, data) => {
      // const { dispatch, segment } = data
      // dispatch(updateTransportationMode(segment.get('id'), text, data.modeId))
    }
  }
}