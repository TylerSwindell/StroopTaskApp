import { createContext, useContext, useReducer } from "react";
import stroopTextReducer, { INITIAL_STATE as initialTextState } from "../reducers/stroopTextReducer";
import { STROOP_TEXT } from "../config/actionTypes";

const { SET_STROOP_TEXT } = STROOP_TEXT

export const StroopTextContext = createContext(initialTextState)

export function useStroopText() {
    return useContext(StroopTextContext)
  }

const fixationCrossTimeout = 350, stroopWordInterval = 1500

const CONSTANTS = {
    fixationCrossTimeout,
    stroopWordInterval,
    stroopTaskInterval: (fixationCrossTimeout + stroopWordInterval),
    fixationCross: '+',
    colorOptions: [ 'red', 'yellow', 'green', 'blue' ]
}



export function StroopTextProvider({ children }) {
    const {colorOptions, fixationCross} = CONSTANTS

    // Reducers
		const [state, dispatch] = useReducer(stroopTextReducer, initialTextState)

    // Text Reducer Methods
    const setText = ({color, text}) => {
        dispatch({
            type: SET_STROOP_TEXT,
            payload: {color, text}
        })
    }

    const HIGH = (colorOptions.length), LOW = 0;
    const randomizeText = () => {
        setText({
            color: colorOptions[(Math.floor(Math.random() * HIGH) + LOW)], 
            text: colorOptions[(Math.floor(Math.random() * HIGH) + LOW)]
        })
    }

    const renderFixationCross = () => {
        setText({color: 'white', text: fixationCross})
    }

    const value = {
        stroopText: {...state},
        setText,
        CONSTANTS

    }

    return (
        <StroopTextContext.Provider value={ value }>
          	{children}
        </StroopTextContext.Provider>
	)
}