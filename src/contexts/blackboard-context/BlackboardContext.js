import { createContext, useContext, useReducer } from "react";
import { StroopTaskProvider } from '../stroop-context/task-context/StoopTaskContext'
import blackboardReducer, { INITIAL_STATE as initialBlackboardState } from "../../reducers/blackboardReducer";
import {BLACKBOARD} from '../../config/actionTypes'

const { 
    SLIDES_START, SLIDES_NEXT, SLIDES_END, 
    PRACTICE_START, PRACTICE_END, STROOP_START, 
    STROOP_END, LOADING_START, LOADING_COMPLETE, 
    NEXT_ROUND, SET_PAUSE, SET_MODE, SET_STARTED,
    SET_CONTENT, SET_COMPLETE, SET_TIMESTAMP,
    SLIDES_PREV,SET_USER_STATE,ROUND_NEXT
} = BLACKBOARD

export const BlackboardContext = createContext(initialBlackboardState)

export function useBlackboard() {
    return useContext(BlackboardContext)
  }

export function BlackboardProvider({ children }) {

    // Reducers
	const [blackboardState, blackboardDispatch] = useReducer(blackboardReducer, initialBlackboardState),
        {
            timestamp, mode, currentRound, started,
            complete, paused, currentSlide, currentElement,
            userState, totalSlides
        } = blackboardState

    // Context Methods
    
    // Blackboard Reducer Methods
    const setCurrentElement = (ele) => {
        blackboardDispatch({
            type: SET_CONTENT,
            payload: ele
        })
    }

    const setMode = (mode) => {
        blackboardDispatch({
            type: SET_MODE,
            payload: mode
        })
    }

    const nextSlide = () => {
        // Guard clause
        if (currentSlide === totalSlides-1) return false
        
        blackboardDispatch({ type: SLIDES_NEXT }) 
        return true
    }
    
    const prevSlide = () => {
        // Guard clause
        if (currentSlide === 0) return false     

        blackboardDispatch({ type: SLIDES_PREV }) 
        return true
    }
    
    const nextRound = () => {
        blackboardDispatch({ type: ROUND_NEXT })
    }


    const setUserState = (userState) => {
        blackboardDispatch({
            type: SET_USER_STATE,
            payload: userState
        })
    }

    const setPaused = (bool) => {
        blackboardDispatch({type: SET_PAUSE, payload: bool})
    }

    const setComplete = (bool) => {
        blackboardDispatch({type: SET_COMPLETE, payload: bool})
    }

    const setTimestamp = (time) => {
        blackboardDispatch({
            type: SET_TIMESTAMP,
            payload: time
        })
    }
    
    const startPractice = () => {
        blackboardDispatch({
            type: PRACTICE_START
        })
    }

    const value = { 
        timestamp, currentRound, mode,
        started, complete, paused,
        currentSlide, currentElement,
        userState, totalSlides,
        setCurrentElement,
        nextSlide, setPaused,
        setUserState,
        setMode, setComplete,
        prevSlide, setTimestamp,
        nextRound, startPractice
    }

    return (
        
            <BlackboardContext.Provider value={ value }>
                <StroopTaskProvider>
                    {children}
                </StroopTaskProvider>
            </BlackboardContext.Provider>
	)
}
