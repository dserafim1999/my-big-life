import { EXAMPLE_ACTION } from ".";

/**
 * Example of an action that will be dispatched to the store with 2 parameters
 */
export const actionExample = (param1, param2) => ({
    param1,
    param2,
    type: 'example/action_type'
})

/**
 * Example of another way to create an action that will be dispatched to the store with 2 parameters
 * This can be useful to dispatch another action simultaneously, for instance
 */
 export const actionExampleAlternate = (param1, param2) => {
    return (dispatch, getState) => {
        dispatch(actionExample(param1, param2)); // dispatches another defined action 
        dispatch({
            param1,
            param2,
            type: EXAMPLE_ACTION // type is a string
        });
    }
}


/**
 * Example of an HTTP request to the server
 * 
 */
export const requestExample = () => {
    return (dispatch, getState) => {
      const options = {
        method: 'GET',
        mode: 'cors'
      }

      const addr = getState().get('general').get('server');
      const route = '/exampleRoute';
      
      return fetch(addr + route, options)
        .then((response) => response.json())
        .catch((e) => console.error(e))
        .then((results) => {
            // logic is added here
            dispatch(actionExample(results.param1, results.param2)); // the usual situation is to dispatch an action using the request results
        });
    }
  }
  