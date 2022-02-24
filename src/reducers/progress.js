import { ADJUST_STAGE, ANNOTATE_STAGE } from '../constants'
import { ADVANCE_TO_ADJUST, ADVANCE_TO_ANNOTATE, SET_SERVER_STATE } from '../actions'
import { Map, fromJS } from 'immutable'

const advanceToAdjust = (state, action) => {
    return state.set('step', ADJUST_STAGE)
}

const advanceToAnnotate = (state, action) => {
    return state.set('step', ANNOTATE_STAGE)
}

const setServerState = (state, action) => {
  return state.set('step', action.step)
    .set('remainingTracks', fromJS(action.tracksRemaining))
    .set('daySelected', action.daySelected)
    .set('initLIFE', action.life)
    .set('lifeQueue', action.lifeQueue)
}

const updateConfig = (state, action) => {
    return state.set('config', new Map(action.config))
}
 
const ACTION_REACTION = {
    'progress/advance_adjust': advanceToAdjust,
    'progress/advance_annotate': advanceToAnnotate,
    'progress/set_server_state': setServerState,
    'progress/update_config': updateConfig
}

const initialState = fromJS({
    step: -2,
    remainingTracks: [],
    server: 'http://localhost:5000'
})

const progress = (state = initialState, action) => {
    if (ACTION_REACTION[action.type]) {
        return ACTION_REACTION[action.type](state, action)
    } else {
        return state
    }
}

export default progress