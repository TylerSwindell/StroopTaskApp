import STROOP_ROUND_ACTION_TYPES from "../config/action-types/stroopRoundActionTypes"

const { 
    SET_ROUND, SET_KEYPRESS, SET_TIME_START, SET_TIME_END, 
    SET_CORRECT, SET_CONGRUENT, NO_KEY_PRESS, NEW_ROUND,
} = STROOP_ROUND_ACTION_TYPES

export const INITIAL_STATE = {
    roundNum: 0,
    keyPressed: null,
    text: null,
    color: null,
    congruent: null,    // bool
    correct: null,      // bool
    roundTime: {
        startTime: {
            sec: null,  // new Date().getSeconds(),
            ms: null    // new Date().getMilliseconds()
        },
        endTime: {
            sec: null,
            ms: null
        }
    }
}

// TODO: FINISH ADDING METHODS FOR ROUNDS
export default function stroopRoundReducer(state, action) {
    const {type, payload} = action

    switch(type) {
        case NEW_ROUND: 
            return {
                ...INITIAL_STATE,
                ...payload

            }
        default: throw new Error(`No case for type ${type}`)
    }
}