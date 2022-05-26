import { Map, List, fromJS } from 'immutable';

const updateQueryBlock = (state, action) => {
  const query = state.toJS()["query"];
  const index = query.findIndex((obj) => obj.id === action.queryBlock.id);

  query[index] = action.queryBlock;

  return state.setIn(['query'], List(query));
}

const addQueryStay = (state, action) => {
  const query = state.toJS()["query"];

  query.push(action.stay);
  
  return state.setIn(['query'], List(query));
}

const addQueryStayAndRoute = (state, action) => {
  const query = state.toJS()["query"];
  
  query.push(action.route);
  query.push(action.stay);

  return state.setIn(['query'], List(query));
}

const connectStayWithRoute = (stay1, route, stay2) => {
  route.start = stay1.end;
  route.end = stay2.start;

  return [route, stay2];        
}

const removeQueryStay = (state, action) => {
  const query = state.toJS()["query"];
  const index = query.findIndex((obj) => obj.id === action.stayId);
  
  if (index % 2 == 0) { //stays always have an even index
    if (index == 0) {
      if (query.length == 0) {
        query.splice(index, 1); // removes first stay 
      } else {
        query.splice(index, 2); // removes first stay and route
      }
    } else if (index === query.length - 1) {
      query.splice(index - 1, 2); // removes last stay and route
    } else { // removes stay, both routes connected to it and creates new route between the stays the deleted one was between
      const queryTail = connectStayWithRoute(
        query[index - 2],
        query[index + 1],
        query[index + 2]
      );
        
      query.splice(index - 1, 4, ...queryTail);
    }   
  }

  return state.setIn(["query"], List(query));
}

const resetQuery = (state) => {
  return state.setIn(["query"], List());
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