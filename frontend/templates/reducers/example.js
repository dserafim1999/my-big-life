import { Map } from 'immutable';

/**
 * To add a new reducer file, you must send it as a parameter to the combineReducers function 
 * in the reducer folder's index.js file.
 */


/**
 * Example of an action reducer. Returns a modified copy of the state.
 * action contains the data that was associated when dispatching to the store.
 */
 const exampleReducer = (state, action) => {
  return state
    .set('state_key1', action.param1)
    .set('state_key2', action.param2);
}

// Allows for easier abstraction of the action recognition by associating a reducer function to an action type
const ACTION_REACTION = {
    'example/action_type': exampleReducer
}

// Sets this state section's initial values and parameters
const initialState = Map({
    state_key1: [],
    state_key2: 'example'    
});

const example = (state = initialState, action) => {
  if (ACTION_REACTION[action.type]) {
    return ACTION_REACTION[action.type](state, action); // associates an action type with the reducer functions that was paired in the ACTION_REACTION constant
  } else {
    return state;
  }
}

export default example;