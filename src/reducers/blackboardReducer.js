import Slide from "../pages/blackboard/components/Slide"
import SlideContent from '../pages/blackboard/config/SlideContent'
import { BLACKBOARD } from "../config/actionTypes"
import StroopTask from "../pages/blackboard/components/stroop/StroopTask"

const { 
    SLIDES_START, SLIDES_NEXT, SLIDES_END, 
    PRACTICE_START, PRACTICE_END, STROOP_START, 
    STROOP_END, LOADING_START, LOADING_COMPLETE, 
    ROUND_NEXT, SET_PAUSE, SET_MODE, SET_STARTED,
    SET_CONTENT, SET_COMPLETE, SET_TIMESTAMP,
    SLIDES_PREV, SET_USER_STATE
} = BLACKBOARD

export const INITIAL_STATE = {
    timestamp: null,
    currentRound: null,
    mode: 'login',
    started: false,
    complete: false,
    paused: false,
    fullscreen: false,
    currentSlide: 0,
    totalSlides: SlideContent.slides.length,
    currentElement: <Slide slideContent={SlideContent.slides[0]}/>,
    userState: null,
    slideContent: SlideContent
}

export default function blackboardReducer(state, action) {
    const {type, payload} = action

    switch(type) {
        case SLIDES_START:
            return {
                ...state,
                // Add state changes
            }
        case SLIDES_NEXT:
            return {
                ...state,
                currentSlide: (state.currentSlide + 1),
                currentElement: <Slide slideContent={SlideContent.slides[state.currentSlide + 1]}/>,

            }
        case SLIDES_PREV:
                return {
                    ...state,
                    currentSlide: (state.currentSlide - 1),
                    currentElement: <Slide slideContent={SlideContent.slides[state.currentSlide - 1]}/>,
                }
        case SLIDES_END:
            return {
                ...state,
                // Add state changes
            }
        case PRACTICE_START:
            return {
                ...state,
                mode: 'practice',
                currentElement: <StroopTask />
            }
        case PRACTICE_END:
            return {
                ...state,
                // Add State changes
            }
        case STROOP_START:
            return {
                ...state,
                // Add state changes
            }
        case SET_PAUSE:
            return {
                ...state,
                paused: payload
            }
        case STROOP_END:
            return {
                ...state,
                // Add state changes
            }
        case LOADING_START:
            return {
                ...state,
                loading: true
            }
        case LOADING_COMPLETE:
            return {
                ...state,
                loading: false
            }
        case ROUND_NEXT:
            return {
                ...state,
                currentRound: (state.currentRound+1)
            }
        case SET_MODE:
            return {
                ...state,
                mode: payload
            }
        case SET_STARTED:
            return {
                ...state,
                started: payload
            }
        case SET_COMPLETE:
            return {
                ...state,
                complete: payload
            }
        case SET_CONTENT: 
            return {
                ...state,
                currentElement: payload
            }
        case SET_TIMESTAMP:
            return {
                ...state,
                timestamp: payload
            }
        case SET_USER_STATE:
            return {
                ...state,
                userState: payload
            }
        default: throw new Error(`No case for type ${type}`)
    }
}