import { clearAll, displayTrips } from "./tracks";
import { setLoading } from './general';
import { ADD_QUERY_STAY, ADD_QUERY_STAY_AND_ROUTE, QUERY_RESULTS, REMOVE_QUERY_STAY, RESET_QUERY, UPDATE_QUERY_BLOCK } from ".";

/**
 * Sends query object to server to be executed.
 * 
 * @request
 * @param {object} params Object containing the query string (data) and indication if results should be loaded all at once (loadAll)  
 */
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
                dispatch(queryResults(res.results, true, res.total, res.querySize))
            }
        ); 
    }
}

/**
 * Loads more results that have yet to be loaded.
 * 
 * @request
 */
export const loadMoreQueryResults = () => {
    return (dispatch, getState) => {
        dispatch(setLoading('load-more-button', true));
        const options = {
            method: 'POST',
            mode: 'cors',
        }
        const addr = getState().get('general').get('server');
        return fetch(addr + '/queries/loadMoreResults', options)
            .then((response) => response.json())
            .catch((e) => console.error(e))
            .then((res) => {
                dispatch(setLoading('load-more-button', false));
                dispatch(queryResults(res.results, false, res.total, res.querySize))
            }
        ); 
    }
}

/**
 * Updates a query block on the timeline.
 * 
 * A query block contains the content of the query component (`Stay` or `Route`) and info for the visual representation.
 * 
 * @action
 * @param {object} block Query block object
 * @returns Action Object
 */
export const updateQueryBlock = (block) => {console.log(block); return{
    block,
    type: UPDATE_QUERY_BLOCK
}};

/**
 * Adds a `Stay` object to the query.
 * 
 * (A `Stay` represents a period of time spent at a location)
 * 
 * @action
 * @param {object} stay Stay to add to query 
 * @returns Action Object
 */
export const addQueryStay = (stay) => ({
    stay,
    type: ADD_QUERY_STAY
});

/**
 * Adds a `Stay` object to the query and the `Route` between it and the last `Stay` in the query.
 * 
 * (A `Stay` represents a period of time spent at a location, while a `Route` represents a period of time between `Stay`s)
 * 
 * @action
 * @param {object} stay Stay to add to query 
 * @param {object} route Route to add to query 
 * @returns Action Object
 */
export const addQueryStayAndRoute = (stay, route) => ({
    stay,
    route,
    type: ADD_QUERY_STAY_AND_ROUTE
});

/**
 * Removes `Stay` (and connecting `Route`, if any) from current query object.
 * 
 * @action
 * @param {number} stayId Id of stay to remove 
 * @returns Action Object
 */
export const removeQueryStay = (stayId) => ({
    stayId,
    type: REMOVE_QUERY_STAY
});

/**
 * Clears query object from state.
 * 
 * @function 
 */
export const resetQuery = () => {
    return (dispatch) => {
        dispatch(clearAll());
        dispatch({type: RESET_QUERY});
    }
};

/**
 * Loads results for the executed query. 
 * 
 * Only loads x amount of results at a time, defined in Settings.
 * 
 * @function
 * @param {Array} results Loaded results
 * @param {boolean} clean If results replace previous or are appended.
 * @param {number} total Total number of results
 * @param {number} querySize Number of query blocks in query
 */
export const queryResults = (results, clean, total, querySize) => {
    return (dispatch, getState) => {
        var tracks = [];
        
        if (!clean) {
            results = getState().get("queries").toJS()["results"].concat(results);
        }
        
        var canLoadMore = results.length < total;
        
        for (var i = 0 ; i < results.length ; i++) {
            const result = results[i].result;
            for(var j = 0 ; j < result.length ; j++) {
                const res = result[j];

                if (res.type === "interval" || querySize === 1) {
                    if(res.points.points.length == 1) {
                        res.points.points[0].label = res.id; // Adds location name to location point
                    }
                    tracks.push(res.points);
                } 
            }
        }        
        
        dispatch(clearAll());
        dispatch(displayTrips(tracks));
        dispatch({results, clean, canLoadMore, type: QUERY_RESULTS});
    }
};