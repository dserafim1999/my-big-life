import { Map, List } from 'immutable';

/**
 * Updates a query block's neighbours' x position constraints.
 * 
 * @function
 * @param {object} query Query block
 * @param {number} index Index of query block in query object 
 * @returns Updated query object 
 */
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

/**
 * Updates a query block's x position constraints.
 * 
 * @function
 * @param {object} query Query block
 * @param {number} index Index of query block in query object 
 * @returns Updated query object 
 */
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

/**
 * Updates a query block on the timeline.
 * 
 * A query block contains the content of the query component (`Stay` or `Route`) and info for the visual representation.
 */
const updateQueryBlock = (state, action) => {
  var query = state.toJS()["query"];
  const index = query.findIndex((obj) => obj.queryBlock.id === action.block.queryBlock.id);

  query[index] = action.block;

  if (query[index].queryBlock.hasOwnProperty('x')) {
    query = updateNeighbourMinMaxX(query, index);
  }

  return state.setIn(['query'], List(query));
}

/**
 * Adds a `Stay` object to the query.
 * 
 * (A `Stay` represents a period of time spent at a location)
 */
const addQueryStay = (state, action) => {
  var query = state.toJS()["query"];

  query.push(action.stay);

  if (query[query.length - 1].queryBlock.hasOwnProperty('x')) {
    query = updateMinMaxX(query, query.length - 1);
  }

  return state.setIn(['query'], List(query));
}

/**
 * Adds a `Stay` object to the query and the `Route` between it and the last `Stay` in the query.
 * 
 * (A `Stay` represents a period of time spent at a location, while a `Route` represents a period of time between `Stay`s)
 */
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

/**
 * Connects 2 `Stay`s with a `Route`
 * 
 * @param {object} stay1 A `Stay`
 * @param {object} route `Route` that connects `Stay`s
 * @param {object} stay2 Another `Stay`
 * @returns Array with `Stay`s and connecting `Route`
 */
const connectStayWithRoute = (stay1, route, stay2) => {
  route.start = stay1.end;
  route.end = stay2.start;

  return [route, stay2];        
}

/**
 * Removes `Stay` (and connecting `Route`, if any) from current query object.
 */
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

/**
 * Clears query object from state.
 */
const resetQuery = (state) => {
  return state
    .setIn(["query"], List())
    .setIn(["results"], List())
    .setIn(["canLoadMore"], true);
}

/**
 * Loads results for the executed query. 
 * 
 * Only loads x amount of results at a time, defined in Settings.
 */
const queryResults = (state, action) => {
  return state
    .setIn(["results"], List(action.results))
    .setIn(["canLoadMore"], action.canLoadMore);
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
  results: List(),
  canLoadMore: true
});

const queries = (state = initialState, action) => {
  if (ACTION_REACTION[action.type]) {
    return ACTION_REACTION[action.type](state, action);
  } else {
    return state;
  }
}

export default queries;