import { STROOP_ROUNDS } from "../config/actionTypes"

const { 
    SET_TIME_START,
    SET_TIME_END,
    SET_CORRECT,
    SET_CONGRUENT
} = STROOP_ROUNDS

export const INITIAL_STATE = {
    roundNum: 1,
    keyPressed: 0,
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
        case NEXT_ROUND:
            return {
                ...state,
                roundNum: (state.roundNum + 1)
            }
        case SET_KEYPRESS:
            return {
                ...state,
                keyPressed: payload
            }
        case SET_TIME_START:
            return {    
                ...state,
                startTime: payload
            }
        case SET_TIME_END:
            return {    
                ...state,
                endTime: payload
            }
        case SET_CORRECT:
            return {
                ...state,
                correct: (payload)
            }
        case SET_CONGRUENT:
                return {
                    ...state,
                    congruent: (payload)
                }
        default: throw new Error(`No case for type ${type}`)
    }
}