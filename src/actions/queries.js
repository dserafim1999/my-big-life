import { clearAll, displayAllTrips } from "./tracks";
import { setLoading } from './general';

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
                console.log(res.segments)
                dispatch(setLoading('query-button', false));
                dispatch(clearAll());
                dispatch(displayAllTrips(res.segments));
            }
        ); 
    }
}