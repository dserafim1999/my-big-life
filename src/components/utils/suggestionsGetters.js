import {
  updateLocationName,
  updateTransportationMode,
  selectPointInMap,
  deselectPointInMap
} from '../../actions/segments'

const filterSuggestions = (text, suggestions) => {
  let filtered = suggestions.filter((s) => s.match(text))
  filtered = filtered.filter((s) => s.toLowerCase() !== text.toLowerCase())
  filtered = filtered.length === 0 ? suggestions : filtered
  filtered = filtered.filter((s) => s.toLowerCase() !== text.toLowerCase())
  return filtered
}

const createPlaceSuggestions = (index) => (
  {
    type: 'TEXT',
    getter: (text, data, callback) => {
      const from = data.segment.get('locations').get(index)
      if (from) {
        return callback(filterSuggestions(data.value, from.get('other').map((l) => l.get('label')).toJS()))
      } else {
        return callback([])
      }
    },
    setter: (text, data) => {
      const { dispatch, segment } = data
      dispatch(updateLocationName(segment.get('id'), text, !index))
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
      const tmode = data.segment.get('transportationModes').get(data.modeId)
      const MODES = {
        '0': 'Stop',
        '1': 'Foot',
        '2': 'Vehicle'
      }
      if (tmode) {
        const list = tmode.get('classification').entrySeq().sort((a, b) => (a[1] < b[1])).map((v) => MODES[v[0]]).toJS()
        return callback(filterSuggestions(data.value, list))
      } else {
        return []
      }
    },
    setter: (text, data) => {
      const { dispatch, segment } = data
      dispatch(updateTransportationMode(segment.get('id'), text, data.modeId))
    }
  }
}