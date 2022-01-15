import { combineReducers } from 'redux';

const tracks = (state = [], action) => {
  switch (action.type) {
    case 'track/add':
      return [...state, action.track];
    default:
      return state;
  }
}

const app = combineReducers({
  tracks
});

export default app;
