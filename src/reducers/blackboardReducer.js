import Slide from "../pages/blackboard/components/Slide"
import SlideContent from '../pages/blackboard/config/SlideContent'
import BLACKBOARD_ACTION_TYPES from "../config/action-types/blackboardActionTypes"
import StroopTask from "../pages/blackboard/components/stroop/StroopTask"

const { 
    SLIDES_START, SLIDES_NEXT, SLIDES_END, 
    PRACTICE_START, PRACTICE_END, STROOP_START, 
    STROOP_END, LOADING_START, LOADING_COMPLETE, 
    ROUND_NEXT, SET_PAUSE, SET_MODE, SET_STARTED,
    SET_CONTENT, SET_COMPLETE, SET_TIMESTAMP,
    SLIDES_PREV, SET_USER_STATE,
    SET_FIXATION_MODE
} = BLACKBOARD_ACTION_TYPES

export const BLACKBOARD_MODES = {
    LOGIN: 'login', 
    PRACTICE: 'practice', 
    PRACTICE_COMPLETE: 'practice-complete', 
    FINAL: 'final', 
    FINAL_COMPLETE: 'final-complete',
    SLIDES: 'slides'
}

export const INITIAL_STATE = {
    timestamp: null,
    currentRound: null,
    mode: BLACKBOARD_MODES.LOGIN,
    started: false,
    complete: false,
    paused: false,
    fullscreen: false,
    currentSlide: 0,
    totalSlides: SlideContent.slides.length,
    currentElement: null,
    userState: null,
    slideContent: SlideContent,
    error: '',
    searchState: null,
    fixationMode: false
}

export default function blackboardReducer(state, action) {
    const {type, payload} = action

    switch(type) {
        case SLIDES_START:
            return {
                ...state,
                mode: BLACKBOARD_MODES.SLIDES,
                currentSlide: 0,
                currentElement: <Slide slideContent={SlideContent.slides[0]}/>,
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
                mode: BLACKBOARD_MODES.PRACTICE,
                started: true,
                currentRound: 0,
                currentElement: <StroopTask />
            }
        case PRACTICE_END:
            return {
                ...state,
                mode: BLACKBOARD_MODES.PRACTICE_COMPLETE,
                started: false,
                currentElement: <Slide slideContent={SlideContent.practiceComplete}/>
            }
        case STROOP_START:
            return {
                ...state,
                mode: BLACKBOARD_MODES.FINAL,
                started: true,
                currentRound: 0,
                currentElement: <StroopTask />
            }
        case STROOP_END:
            return {
                ...state,
                mode: BLACKBOARD_MODES.FINAL_COMPLETE,
                started: false,
                currentElement: <Slide slideContent={SlideContent.stroopComplete}/>
            }
        case SET_PAUSE:
            return {
                ...state,
                paused: payload
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
            case SET_FIXATION_MODE: 
            return {
                ...state
            }
        default: throw new Error(`No case for type ${type}`)
    }
}