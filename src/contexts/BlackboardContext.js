import { createContext, useContext, useReducer } from "react";
import blackboardReducer, { INITIAL_STATE } from "../reducers/blackboardReducer";
import {BLACKBOARD} from '../config/actionTypes'

const { 
    SLIDES_START, SLIDES_NEXT, SLIDES_END, 
    PRACTICE_START, PRACTICE_END, STROOP_START, 
    STROOP_END, LOADING_START, LOADING_COMPLETE, 
    NEXT_ROUND, SET_PAUSE, SET_MODE, SET_STARTED,
    SET_CONTENT, SET_COMPLETE, SET_TIMESTAMP,
    SLIDES_PREV,SET_USER_STATE,ROUND_NEXT
} = BLACKBOARD

export const BlackboardContext = createContext(INITIAL_STATE)

export function useBlackboard() {
    return useContext(BlackboardContext)
  }

export function BlackboardProvider({ children }) {
	const [state, dispatch] = useReducer(blackboardReducer, INITIAL_STATE)
    const {
        timestamp, mode, currentRound, started,
        complete, paused, currentSlide, currentElement,
        slideContent, userState, totalSlides
    } = state

    const nextSlide = () => {
            dispatch({ type: SLIDES_NEXT })
    }

    const nextRound = () => {
        dispatch({ type: ROUND_NEXT })
    }

    const prevSlide = () => {
        console.log(totalSlides, currentSlide)
        if (currentSlide > 0) 
            dispatch({ type: SLIDES_PREV })
        else console.log('NO MORE SLIDES')
    }

    const setCurrentElement = (ele) => {
        dispatch({
            type: SET_CONTENT,
            payload: ele
        })
    }

    const setMode = (mode) => {
        dispatch({
            type: SET_MODE,
            payload: mode
        })
    }

    const setUserState = (userState) => {
        dispatch({
            type: SET_USER_STATE,
            payload: userState
        })
    }

    const setPaused = (bool) => {
        dispatch({type: SET_PAUSE, payload: bool})
    }

    const setComplete = (bool) => {
        dispatch({type: SET_COMPLETE, payload: bool})
    }

    const setTimestamp = (time) => {
        dispatch({
            type: SET_TIMESTAMP,
            payload: time
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
        nextRound
    }

    return (
        <BlackboardContext.Provider value={ value }>
          	{children}
        </BlackboardContext.Provider>
	)
}
