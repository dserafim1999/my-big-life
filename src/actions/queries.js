import { clearAll, displayTrips } from "./tracks";
import { setLoading } from './general';
import { ADD_QUERY_STAY, ADD_QUERY_STAY_AND_ROUTE, QUERY_RESULTS, REMOVE_QUERY_STAY, RESET_QUERY, UPDATE_QUERY_BLOCK } from ".";

export const executeQuery = (params) => {
    return (dispatch, getState) => {
        dispatch(setLoading('query-button', true));
        const options = {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(params)
        }
        const addr = getState().get('general').get('server');
        return fetch(addr + '/queries/execute', options)
            .then((response) => response.json())
            .catch((e) => console.error(e))
            .then((res) => {
                dispatch(setLoading('query-button', false));
                dispatch(queryResults(res.results, res.segments, true, res.total))
            }
        ); 
    }
}

export const loadMoreQueryResults = (params) => {
    return (dispatch, getState) => {
        dispatch(setLoading('load-more-button', true));
        const options = {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify(params)
        }
        const addr = getState().get('general').get('server');
        return fetch(addr + '/queries/loadMoreResults', options)
            .then((response) => response.json())
            .catch((e) => console.error(e))
            .then((res) => {
                dispatch(setLoading('load-more-button', false));
                dispatch(queryResults(res.results, res.segments, false, res.total))
            }
        ); 
    }
}

export const updateQueryBlock = (block) => ({
    block,
    type: UPDATE_QUERY_BLOCK
});

export const addQueryStay = (stay) => ({
    stay,
    type: ADD_QUERY_STAY
});

export const addQueryStayAndRoute = (stay, route) => ({
    stay,
    route,
    type: ADD_QUERY_STAY_AND_ROUTE
});

export const removeQueryStay = (stayId) => ({
    stayId,
    type: REMOVE_QUERY_STAY
});

export const resetQuery = () => {
    return (dispatch) => {
        dispatch(clearAll());
        dispatch({type: RESET_QUERY});
    }
};

export const queryResults = (results, segments, clean, total) => {
    return (dispatch) => {
        dispatch(clearAll());
        //TODO Append dispatch(displayTrips(segments));
        dispatch({results, clean, total, type: QUERY_RESULTS});
    }
};