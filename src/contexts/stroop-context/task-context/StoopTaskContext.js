// REACT LIBRARY
import { createContext, useContext, useReducer } from "react";

// REDUCER IMPORTS
import stroopTrialReducer, { INITIAL_STATE as initialTrialState } from "../../../reducers/stroopTrialReducer";
import stroopRoundReducer, { INITIAL_STATE as initialRoundState } from "../../../reducers/stroopRoundReducer";

// ACTION TYPE IMPORTS
import STROOP_TRIAL_ACTION_TYPES from "../../../config/action-types/stroopTrialActionTypes";
import STROOP_ROUND_ACTION_TYPES from "../../../config/action-types/stroopRoundActionTypes"
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useBlackboard } from "../../blackboard-context/BlackboardContext";
import StroopText from "../../../pages/blackboard/components/stroop/StroopText";
import { numberOfRounds, numberOfTests, testMode } from "../../../config/MainConfig";
import { useGlobal } from "../../global-context/GlobalContext";

// ACTION TYPE DESTRUCTURING
const { 
    RESET, PUSH_PRACTICE_TRIAL, PUSH_FINAL_TRIAL, 
    SET_DATE, PUSH_ALL_ROUNDS, SET_CONGRUENT,
    PUSH_PRACTICE_ROUNDS, SET_TIME_END
} = STROOP_TRIAL_ACTION_TYPES

const { 
    NEW_ROUND, SET_ROUND, NEXT_ROUND, 
    SET_TIME_START, SET_CORRECT
} = STROOP_ROUND_ACTION_TYPES

// CONSTANT DECLARATIONS
const fixationCrossTimeout = 350, stroopWordInterval = 1500,
        stroopTaskInterval = fixationCrossTimeout + stroopWordInterval
const CONSTANTS = {
    fixationCrossTimeout,
    stroopWordInterval,
    stroopTaskInterval,
    fixationCross: '+',
    colorOptions: [ 'red', 'yellow', 'green', 'blue' ]
}

const LOW = 0
const HIGH = (CONSTANTS.colorOptions.length)

export const StroopTaskContext = createContext(initialTrialState)
export const useStroopTask = () => useContext(StroopTaskContext)

export const StroopTaskProvider = ({ children }) => {

    const {userState, setUserState, setCurrentElement} = useBlackboard()
    const { isInTestMode } = useGlobal()

    // Reducers
    const [trialState, trialDispatch] = useReducer(stroopTrialReducer, initialTrialState)

    const generateColorList = () => {
        let practiceRounds = [], 
            finalRounds = [],
            totalCongruent = 0

        const totalRoundCount = getPracticeRoundCount() + getFinalRoundCount()
        for (let i = 0; i < totalRoundCount; i++) {

            const color = CONSTANTS.colorOptions[(Math.floor(Math.random() * HIGH) + LOW)]
            const text = CONSTANTS.colorOptions[(Math.floor(Math.random() * HIGH) + LOW)]
            const congruent = (text === color)
            const stroopText = { text, color, congruent }

            if (congruent) totalCongruent++
            if (i < getPracticeRoundCount()) 
                practiceRounds.push(stroopText) 
            else finalRounds.push(stroopText)
        }

        return {
            practiceRounds,
            finalRounds,
            totalCongruent,
        }
    }

    const resetTrial = () => {
        trialDispatch({type: RESET})
    }

    const getTime = () => ({
        h: new Date().getHours(),
        m: new Date().getMinutes(),
        sec: new Date().getSeconds(),
        ms: new Date().getMilliseconds()
    })

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

    const pushStartTime = (payload) => {
        const {mode, roundNum} = payload
        trialDispatch({
            type: 'PUSH_TIME_START',
            payload: {mode, roundNum, ...getTime()}
        })
    }


    const pushEndTime = (payload) => {
        const {mode, roundNum, keyDown} = payload
        trialDispatch({
            type: 'PUSH_TIME_END',
            payload: {mode, roundNum, keyDown, ...getTime()}
        })
    }

    // CLEAN UP DATA OUTPUT!
    const setEndTime = () => {
        const { h, m, s } = generateCurrentDateAndTime()

        
        console.log(h, m, s)
        trialDispatch({
            type: SET_TIME_END,
            payload: { h, m, s }
        })
    }

    const newTrial = (userState) => {
        resetTrial()

        const { day, month, year, h, m, s } = generateCurrentDateAndTime()
        trialDispatch({
            type: SET_DATE,
            payload: { day, month, year }
        })

        trialDispatch({
            type: SET_TIME_START,
            payload: { h, m ,s }
        })

        let { practiceRounds, finalRounds, totalCongruent } = generateColorList()

        practiceRounds = practiceRounds.map((round, i) => ({ ...initialRoundState, ...round, roundNum: i }))
        finalRounds = finalRounds.map((round, i) => ({ ...initialRoundState, ...round, roundNum: i }))

        trialDispatch({
            type: PUSH_ALL_ROUNDS,
            payload: { practiceRounds, finalRounds }
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

    const pushPracticeRounds = () => {
        trialDispatch({
            type: PUSH_PRACTICE_ROUNDS,
            payload: trialState.practiceRounds
        })
    }

    const pushButtonPress = (payload) => {
        const {mode, roundNum, keyPressed, isCorrect} = payload
        trialDispatch({
            type: 'KEY_PRESS',
            payload: {mode, roundNum, keyPressed, isCorrect, pressTime: getTime()}
        })
    }

    // 
    const consolidateData = async () => {    
        let listOfTrials = userState.listOfTrials
        console.log(trialState)
        const {totalCongruent} = trialState

        let totalCorrect = 0
        trialState.keyPressList.forEach((keyPress) => {
            if (keyPress.isCorrect) totalCorrect++
        })

        const dataSummary = {
            sessionNumber: listOfTrials.length,
            totalCongruent,
            totalCorrect
            

        }
        listOfTrials.push({trialState,dataSummary})

        console.log(trialState, dataSummary)

        setUserState({...userState, listOfTrials})

        try { await setDoc(doc(db, "participants", userState.pid), userState) } 
		catch (e) { 
            console.error("Error adding document: ", e) 
            setCurrentElement(<StroopText color='red' text='Error Uploading Data'/>)
        }
    }

    function getPracticeRoundCount() { 
        return (isInTestMode)? numberOfTests.practice : numberOfRounds.practice 
    }
    function getFinalRoundCount() {
        return (isInTestMode) ? numberOfTests.final : numberOfRounds.final
    }

    const trial = {
        trialState,
        getPracticeRoundCount,
        getFinalRoundCount,
        pushPracticeRounds,
        pushButtonPress,
        consolidateData,
        pushStartTime,
        pushEndTime,
        setEndTime,
        pushTrial,
        newTrial,
    }

    const [roundState, roundDispatch] = useReducer(stroopRoundReducer, initialRoundState)
    
    // Round Reducer Methods
    const newRound = (payload) => {
        roundDispatch({
            type: NEW_ROUND,
            payload
        })
    }

    const setRound = (payload) => {
        roundDispatch({
            type: SET_ROUND,
            payload
        })
    }

    const nextRound = (payload) => roundDispatch({ type: NEXT_ROUND, payload })

    const round = {
        roundState,
        newRound,
        nextRound,
        setRound,
    }


    const value = { trial, round, CONSTANTS, getTime }

    return (
        <StroopTaskContext.Provider value={ value }>
          	{children}
        </StroopTaskContext.Provider>
	)
}
