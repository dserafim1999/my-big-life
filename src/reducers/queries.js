import { Map, List, fromJS } from 'immutable';

const updateQueryBlock = (state, action) => {
  return state.setIn(['query', action.blockId], action.query);
}

const addQueryStay = (state, action) => {
  return state.setIn(['query', action.stayId], action.stay)
}

const addQueryStayAndRoute = (state, action) => {
  return state
      .setIn(['query', action.stayId], action.stay)
      .setIn(['query', action.routeId], action.route);
}

const connectStayWithRoute = (stay1, route, stay2) => {
  route.start = stay1.end;
  route.end = stay2.start;

  return [route, stay2];        
}

const removeQueryStay = (state, action) => {
  const query = state.toJS()["query"];
  console.log(state)
  const index = query.findIndex((obj) => obj.id === action.stayId);
  

  if (index % 2 == 0) { //stays always have an even index
    if (index == 0) {
      if (query.length == 0) {
        query.splice(index, 1);
      } else {
        query.splice(index, 2);
      }
    } else if (index === query.length - 1) {
      query.splice(index - 1, 2);
    } else {
      const queryTail = connectStayWithRoute(
        query[index - 2],
        query[index + 1],
        query[index + 2]
      );

      query.splice(index - 1, 4, ...queryTail);
    }

  }
  console.log(List(query));
  
  return state.setIn(["query"], List(query));

  //return state.deleteIn(['query', action.stayId]);
}

const resetQuery = (state, action) => {
  return state.setIn(['query'], List());
}

const ACTION_REACTION = {
    'queries/update_query_block': updateQueryBlock,
    'queries/add_query_stay': addQueryStay,
    'queries/add_query_stay_and_route': addQueryStayAndRoute,
    'queries/remove_query_stay': removeQueryStay,
    'queries/reset_query': resetQuery,
}

const initialState = Map({
  query: List(),
});

const queries = (state = initialState, action) => {
  if (ACTION_REACTION[action.type]) {
    return ACTION_REACTION[action.type](state, action);
  } else {
    return state;
  }
}

export default queries;