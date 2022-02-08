import { Map } from 'immutable';

const initialState = Map({});

const ui = (state = initialState, action) => {
    switch (action.type) {
      case 'ui/bounds':
        return state.set('bounds', action.bounds);
      default:
        return state;
    }
}

export default ui;