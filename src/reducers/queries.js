import { Map, List } from 'immutable';

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

const removeQueryStay = (state, action) => {
    return state.deleteIn(['query', action.stayId]);
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