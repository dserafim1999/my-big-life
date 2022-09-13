import { ADJUST_STAGE, ANNOTATE_STAGE } from '../constants';
import { fromJS } from 'immutable';

/**
 * Advance to adjust stage in processing.
 */
const advanceToAdjust = (state, action) => {
    return state.set('step', ADJUST_STAGE);
}

/**
 * Advance to annotate stage in processing.
 */
const advanceToAnnotate = (state, action) => {
    return state.set('step', ANNOTATE_STAGE);
}

/**
 * Set state of track processing from server 
 */
const setServerState = (state, action) => {
    return state.set('step', action.step)
        .set('remainingTracks', fromJS(action.tracksRemaining))
        .set('daySelected', action.daySelected)
        .set('initLIFE', action.life)
        .set('LIFEQueue', action.lifeQueue)
        .set('LIFE', '');
}

/**
 * Sets LIFE for track in process
 */
const setLife = (state, action) => {
    return state.set('LIFE', action.text);
}

/**
 * Sets whether server is bulk processing or not
 */
const setIsBulkProcessing = (state, action) => {
    return state.set('isBulkProcessing', action.isBulkProcessing);
}

/**
 * Set percentage of days processed in bulk processing
 */
const setBulkProgress = (state, action) => {
    const isBulkProcessing = action.progress >= 0 && action.progress < 100;
    
    return state.set('bulkProgress', action.progress)
        .set('isBulkProcessing', isBulkProcessing);
}

const ACTION_REACTION = {
    'process/advance_adjust': advanceToAdjust,
    'process/advance_annotate': advanceToAnnotate,
    'process/set_server_state': setServerState,
    'process/set_LIFE': setLife,
    'process/set_is_bulk_processing': setIsBulkProcessing,
    'process/set_bulk_progress': setBulkProgress
}

const initialState = fromJS({
    step: -2,
    remainingTracks: [],
    isBulkProcessing: false
});

const process = (state = initialState, action) => {
    if (ACTION_REACTION[action.type]) {
        return ACTION_REACTION[action.type](state, action);
    } else {
        return state;
    }
}

export default process;