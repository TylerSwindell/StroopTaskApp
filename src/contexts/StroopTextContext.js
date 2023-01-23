import { createContext, useContext, useReducer } from "react";
import stroopTextReducer, { INITIAL_STATE as initialTextState } from "../reducers/stroopTextReducer";
import { STROOP_TEXT } from "../config/actionTypes";

const { SET_STROOP_TEXT } = STROOP_TEXT

export const StroopTextContext = createContext(initialTextState)

export function useStroopText() {
    return useContext(StroopTextContext)
  }

export const  
    fixationCrossTimeout = 350,
    stroopWordInterval = 1500,
    stroopTaskInterval = (fixationCrossTimeout + stroopWordInterval),
    colorOptions = [
        'default',
        'red', 
        'yellow', 
        'green', 
        'blue'
    ],
    textOptions = [
        '+',
        'red', 
        'yellow', 
        'green', 
        'blue'
    ]

export function StroopTextProvider({ children }) {

    // Reducers
		const [state, dispatch] = useReducer(stroopTextReducer, initialTextState)

    // Trial Reducer Methods
    const setText = ({color, text}) => {
        dispatch({
            type: SET_STROOP_TEXT,
            payload: {color, text}
        })
    }

    const HIGH = (colorOptions.length-1), LOW = 1;
    const randomizeText = () => {
        setText({
            color: colorOptions[(Math.floor(Math.random() * HIGH) + LOW)], 
            text: textOptions[(Math.floor(Math.random() * HIGH) + LOW)]
        })
    }

    const value = {
        stroopText: {...state},
        setText, randomizeText

    }

    return (
        <StroopTextContext.Provider value={ value }>
          	{children}
        </StroopTextContext.Provider>
	)
}