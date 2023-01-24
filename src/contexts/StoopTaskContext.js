import { createContext, useContext, useReducer, useState } from "react";
import stroopTrialReducer, { INITIAL_STATE as initialTrialState } from "../reducers/stroopTrialReducer";
import stroopRoundReducer, { INITIAL_STATE as initialRoundState } from "../reducers/stroopRoundReducer";

import { STROOP_TRIALS } from "../config/actionTypes";
const { 
    RESET, PUSH_PRACTICE_TRIAL, PUSH_FINAL_TRIAL, SET_DATE, 
    SET_TIME_START, PUSH_ALL_TRIALS, SET_CONGRUENT, 
} = STROOP_TRIALS

const fixationCrossTimeout = 350, stroopWordInterval = 1500

const CONSTANTS = {
    practiceRoundCount: 10,
    finalRoundCount: 40,
    fixationCrossTimeout,
    stroopWordInterval,
    stroopTaskInterval: (fixationCrossTimeout + stroopWordInterval),
    fixationCross: '+',
    colorOptions: [ 'red', 'yellow', 'green', 'blue' ]
}, HIGH = (CONSTANTS.colorOptions.length), LOW = 0, 
    TOTAL_ROUND_COUNT = (CONSTANTS.finalRoundCount + CONSTANTS.practiceRoundCount)

export const StroopTaskContext = createContext(initialTrialState)
export const useStroopTask = () => useContext(StroopTaskContext)

export const StroopTaskProvider = ({ children }) => {
    const [colorList, setColorList] = useState([])

    // Reducers
    const [trialState, trialDispatch] = useReducer(stroopTrialReducer, initialTrialState)
    const [roundState, roundDispatch] = useReducer(stroopRoundReducer, initialRoundState)
    
    // Round Reducer Methods
    const generateColorList = () => {
        let practiceRounds = [], 
            finalRounds = [],
            totalCongruent = 0

        for (let i = 0; i < TOTAL_ROUND_COUNT; i++) {

            const   color = CONSTANTS.colorOptions[(Math.floor(Math.random() * HIGH) + LOW)]
            const text = CONSTANTS.colorOptions[(Math.floor(Math.random() * HIGH) + LOW)]
            const congruent = (text === color)
            const stroopText = { text, color, congruent }

            if (congruent) totalCongruent++

            if (i < CONSTANTS.practiceRoundCount) practiceRounds.push(stroopText) 
            else finalRounds.push(stroopText)
        }

        return {
            practiceRounds,
            finalRounds,
            totalCongruent
        }
    }

    const round = {

    }

    const resetTrial = () => {
        trialDispatch({type: RESET})
    }

    const generateCurrentDateAndTime = () => {
        const currentDate = new Date() 
        return {
            day: currentDate.getDate(), 
            month: currentDate.getMonth() + 1, 
            year: currentDate.getFullYear(),
            h: currentDate.getHours(), 
            m: currentDate.getMinutes(), 
            s: currentDate.getSeconds()
        }
    }

    const newTrial = () => {
        const { day, month, year, h, m, s } = generateCurrentDateAndTime()
        
        resetTrial()
        trialDispatch({
            type: SET_DATE,
            payload: { day, month, year }
        })

        trialDispatch({
            type: SET_TIME_START,
            payload: { h, m ,s }
        })

        const { practiceRounds, finalRounds, totalCongruent } = generateColorList()

        trialDispatch({
            type: PUSH_ALL_TRIALS,
            payload: {practiceRounds, finalRounds}
        })

        trialDispatch({
            type: SET_CONGRUENT,
            payload: totalCongruent
        })
    }

    // Trial Reducer Methods
    const pushTrial = (mode) => {
        switch(mode) {
            case 'practice':
                trialDispatch({
                    type: PUSH_PRACTICE_TRIAL,
                    payload: trialState
                })
                break
            case 'final':
                trialDispatch({
                    type: PUSH_FINAL_TRIAL,
                    payload: trialState
                })
                break
            default: console.error('pushTrial: No valid mode passed')
        }
    }

    const trial = {
        newTrial,
        pushTrial,
    }


    const value = { trial, round }

    return (
        <StroopTaskContext.Provider value={ value }>
          	{children}
        </StroopTaskContext.Provider>
	)
}
