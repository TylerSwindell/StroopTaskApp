import { STROOP_TRIALS } from "../config/actionTypes"

const { 
    SET_DATE,
    SET_TIME_START,
    SET_END_START,
    PUSH_PRACTICE_TRIAL,
    PUSH_FINAL_TRIAL,
    ADD_CORRECT,
    ADD_CONGRUENT
} = STROOP_TRIALS

export const INITIAL_STATE = {
    date: {
        day: null,
        month: null,
        year: null
    }, 
    startTime: null,
    endTime: null,
    practiceRounds: [],
    finalRounds: [],
    totalCongruent: 0,
    totalCorrect: 0 
}

export default function stroopTrialReducer(state, action) {
    const {type, payload} = action

    switch(type) {
        case SET_DATE:
            const { day, month, year } = payload
            return {    
                ...state,
                date: { day, month, year },
            }
        case SET_TIME_START:
            return {    
                ...state,
                startTime: payload
            }
        case SET_END_START:
            return {    
                ...state,
                endTime: payload
            }
        case PUSH_PRACTICE_TRIAL:
            const practiceRounds = state.practiceRounds.push(payload)
            return {    
                ...state,
                practiceRounds
            }
        case PUSH_FINAL_TRIAL:
            const finalRounds = state.finalRounds.push(payload)
            return {    
                ...state,
                finalRounds
            }
        case ADD_CORRECT:
            return {
                ...state,
                totalCorrect: (state.totalCorrect + 1)
            }
        case ADD_CONGRUENT:
                return {
                    ...state,
                    totalCongruent: (state.totalCongruent + 1)
                }
        default: throw new Error(`No case for type ${type}`)
    }
}