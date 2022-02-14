import { Map } from 'immutable';

const initialState = Map({});

const ui = (state = initialState, action) => {
    switch (action.type) {
      case 'ui/bounds':
        return state.set('bounds', action.bounds);
      case 'ui/show_track_details':
        return state.set('details', true);
      case 'ui/hide_track_details':
        return state.set('details', false);
      case 'ui/update_internal_bounds':
        return state.set('internalBounds', action.bounds);
      default:
        return state;
    }
}

export default ui;