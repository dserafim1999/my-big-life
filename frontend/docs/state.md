As React is used for more UI centric operations, there is no explicit way to control state modifications and
propagation. Therefore, this task is handled by [Redux](https://redux.js.org/), a JavaScript state container. It allows us to have stores that contain representations of our current state. Paired with React, data stores can be binded with components, which will update based on changes in said stores.

## Structure

The application contains a global state that is shared throughout the app that is stored inside an object tree inside a store. The only way to change the state is by creating an action, which describes what happened to the state. This action is then dispatched to the store, where a reducer will decide how said action will transform the application's state. 

As state is immutable, values should also be updated immutably. In other words, any changes should be performed on copies of an object.

### Actions

An action is "an event that describes something that happened in the application". It is described as a plain JavaScript object containing a type field. These can be found in the `actions` folder.


The type field is a descriptive name like "map/highlight_segment". In this project, the first part represents the feature the action belongs to, and the second part the action itself. Features are described in their separate JS file. These types are also abstracted into constants and can be found at `actions\index.js`. There you will also be able to find HTTP requests to the server, as these require the `dispatch` method and/or the global state to parse the incoming data.

An action object can also have other fields with additional parameters.

A typical action object might look like this:
```js static
{
    stayId: 1,
    type: 'queries/remove_query_stay'
}
```

However, as most parameters are dynamically set, you will find the actions stated as methods that return the action object (action creators):

```js static
export const removeQueryStay = (stayId) => ({
    stayId,
    type: REMOVE_QUERY_STAY
});

// Where REMOVE_QUERY_STAY = 'queries/remove_query_stay'
```

This way, you can create an action by dispatching the method with the parameters you want.

### Reducers

A reducer is "an event listener which handles events based on the received action type". In other words, a reducer decides how to update the state given the current state and an action object. However, since state is immutable, it will return a modified copy of the previous state. 

They can be found in the `reducers` folder. Every feature is described in a separate JS file, and all reducer files are combined in `reducers\index.js`.

To set up a reducer, you need to associate a method to the action type that is received. In that method you define what to update in the state. As state can not be modified directly, you must return a copy of the state where you'll make the changes to the copied values. A reducer must always return a state, even if there are no changes.

Example of a reducer method:
```js static
const resetQuery = (state) => {
  return state
    .setIn(["query"], List())
    .setIn(["results"], List())
    .setIn(["canLoadMore"], true);
}
```

### Dispatch

The only way to update the state is to dispatch an action to the store. This can be done by calling the store's `dispatch` method, where the store runs the reducer function that matches the action type provided.

## Connecting a React Component to a Redux Store

You can connect a React Component with a Redux Store using the [connect](https://react-redux.js.org/api/connect) function. 

We will provide a mapStateToProps paramater to connect so that the component subscribes to the store's updates. This means any time the store is updated, so will the component. You can also define props based on values from the store in order to update the component when said values change in the state.

As we only provide the first parameter, `dispatch` will be provided to the component as a prop by default.

Below an example of how to subscribe a component (e.g. AlertBox) to the store:

```js static
const mapStateToProps = (state) => {
  return {
    alerts: state.get('general').get('alerts') || []
  }
}

AlertBox = connect(mapStateToProps)(AlertBox);
```