import { Map, List, fromJS } from 'immutable';

const updateNeighbourMinMaxX = (query, index) => {
  if (query.length > 1 && index % 2 === 0) {
    if (index === 0) {
        query[index + 2].queryBlock.minX = query[index].queryBlock.x;
    } else if (index === query.length - 1) {
        query[index - 2].queryBlock.maxX = query[index].queryBlock.x;
      } else {
        query[index - 2].queryBlock.maxX = query[index].queryBlock.x;
        query[index + 2].queryBlock.minX = query[index].queryBlock.x;
    }
  }

  return query;
}

const updateMinMaxX = (query, index) => {
    if (query.length > 1 && index % 2 === 0) {
      if (index === 0) {
          query[index].queryBlock.maxX = query[index + 2].queryBlock.x;
      } else if (index === query.length - 1) {
          query[index].queryBlock.minX = query[index - 2].queryBlock.x;
      } else {
        query[index].queryBlock.minX = query[index - 2].queryBlock.x;
        query[index].queryBlock.maxX = query[index + 2].queryBlock.x;
    }
  } else {
    query[index].queryBlock.minX = 0;
    query[index].queryBlock.maxX = undefined;
  }

  return query;
}

const updateQueryBlock = (state, action) => {
  var query = state.toJS()["query"];
  const index = query.findIndex((obj) => obj.queryBlock.id === action.block.queryBlock.id);

  query[index] = action.block;

  if (query[index].queryBlock.hasOwnProperty('x')) {
    query = updateNeighbourMinMaxX(query, index);
  }

  return state.setIn(['query'], List(query));
}

const addQueryStay = (state, action) => {
  var query = state.toJS()["query"];

  query.push(action.stay);

  if (query[query.length - 1].queryBlock.hasOwnProperty('x')) {
    query = updateMinMaxX(query, query.length - 1);
  }

  return state.setIn(['query'], List(query));
}

const addQueryStayAndRoute = (state, action) => {
  var query = state.toJS()["query"];
  
  query.push(action.route);
  query.push(action.stay);

  if (query[query.length - 1].queryBlock.hasOwnProperty('x')) {
    query = updateMinMaxX(query, query.length - 1);
    query = updateNeighbourMinMaxX(query, query.length - 1);
  }

  return state.setIn(['query'], List(query));
}

const connectStayWithRoute = (stay1, route, stay2) => {
  route.start = stay1.end;
  route.end = stay2.start;

  return [route, stay2];        
}

const removeQueryStay = (state, action) => {
  const query = state.toJS()["query"];
  const index = query.findIndex((obj) => obj.queryBlock.id === action.stayId);
  
  if (index % 2 == 0) { //stays always have an even index
    if (index == 0) {
      if (query.length === 1) {
        query.splice(index, 1); // removes first stay 
      } else {
        query[index + 2].queryBlock.minX = 0;
        query.splice(index, 2); // removes first stay and route
      }
    } else if (index === query.length - 1) {
      query[index - 2].queryBlock.maxX = undefined;
      query.splice(index - 1, 2); // removes last stay and route
    } else { // removes stay, both routes connected to it and creates new route between the stays the deleted one was between
      query[index - 2].queryBlock.maxX = query[index + 2].queryBlock.x;
      query[index + 2].queryBlock.minX = query[index - 2].queryBlock.x;
      
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
  return state
    .setIn(["query"], List())
    .setIn(["results"], List());
}

const queryResults = (state, action) => {
  return state.setIn(["results"], List(action.results));
}

const ACTION_REACTION = {
    'queries/update_query_block': updateQueryBlock,
    'queries/add_query_stay': addQueryStay,
    'queries/add_query_stay_and_route': addQueryStayAndRoute,
    'queries/remove_query_stay': removeQueryStay,
    'queries/reset_query': resetQuery,
    'queries/query_results': queryResults,
}

const initialState = Map({
  query: List(),
  results: List()
});

const queries = (state = initialState, action) => {
  if (ACTION_REACTION[action.type]) {
    return ACTION_REACTION[action.type](state, action);
  } else {
    return state;
  }
}

export default queries;