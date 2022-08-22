import {
  getLocationSuggestion
} from '../../actions/process';

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
    },
    setter: (text, data) => {
      const { dispatch, segment } = data;
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
  'LocationFrom': createPlaceSuggestions(0)
}