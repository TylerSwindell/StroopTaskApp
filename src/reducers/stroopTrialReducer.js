import STROOP_TRIAL_ACTION_TYPES from "../config/action-types/stroopTrialActionTypes"

const { 
    SET_DATE, SET_TIME_START, SET_TIME_END,
    PUSH_PRACTICE_ROUNDS, PUSH_FINAL_ROUNDS, RESET, 
    PUSH_ALL_ROUNDS, ADD_CORRECT, ADD_CONGRUENT,
    SET_CONGRUENT,
} = STROOP_TRIAL_ACTION_TYPES

export const INITIAL_STATE = {
    date: {
        day: null,
        month: null,
        year: null
    }, 
    startTime: { h: null, m: null, s: null },
    endTime: { h: null, m: null, s: null },
    practiceRounds: [],
    finalRounds: [],
    totalCongruent: 0,
    totalCorrect: 0,
    keyPressList: [],
    startTimeList: [],
    endTimeList:[]
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
        case SET_TIME_END:
            console.log('WE ARE RUNNING THIS STUFF', payload)
            return {    
                ...state,
                endTime: 'THIS IS A TIME'
            }
        case SET_CONGRUENT:
            return {
                ...state,
                totalCongruent: payload

            }
        case PUSH_PRACTICE_ROUNDS: {
            return {    
                ...state,
                practiceRounds: payload
            }
        }
        case PUSH_FINAL_ROUNDS: {
            const finalRounds = state.finalRounds.push(payload)
            return {    
                ...state,
                finalRounds
            }
        }
        case PUSH_ALL_ROUNDS: {
            const { finalRounds, practiceRounds } = payload
            return {    
                ...state,
                practiceRounds,
                finalRounds
            }
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
        case 'KEY_PRESS': 
            const { mode, roundNum, keyPressed, isCorrect, pressTime } = payload
            let newList = state.keyPressList
                newList[(mode === 'final') ? (roundNum + 1) : roundNum] = {roundNum, mode, keyPressed, isCorrect, pressTime}
                
            return {
                ...state,
                keyPressList: newList
            }
        case 'PUSH_TIME_START': {
            const {mode, roundNum, ms, sec} = payload
            let newList = state.startTimeList
                newList[(mode === 'final') ? (roundNum + 1) : roundNum] = { roundNum, mode, sec, ms }
            return {
                ...state,
                startTimeList: newList
            }
        }
        case 'PUSH_TIME_END': {
            const {mode, roundNum, ms, sec, keyDown} = payload
            let newList = state.endTimeList
            newList[(mode === 'final') ? (roundNum + 1) : roundNum] = { roundNum, mode, sec, ms, keyDown}
            return {
                ...state,
                endTimeList: newList
            }
        }
        case RESET: return INITIAL_STATE
        default: throw new Error(`No case for type ${type}`)
    }
}