import { createContext, useContext, useReducer } from "react";
import stroopTextReducer, { INITIAL_STATE as initialTextState } from "../../../reducers/stroopTextReducer";
import STROOP_TEXT_ACTION_TYPES from "../../../config/action-types/stroopTextActionTypes";

const { SET_STROOP_TEXT } = STROOP_TEXT_ACTION_TYPES

export const StroopTextContext = createContext(initialTextState)
export const useStroopText = () => useContext(StroopTextContext)

export function StroopTextProvider({ children }) {

    // Reducers
		const [textState, dispatch] = useReducer(stroopTextReducer, initialTextState)

    // Text Reducer Methods
    const setText = ({color, text}) => {
        dispatch({
            type: SET_STROOP_TEXT,
            payload: {color, text}
        })
    }

    const renderFixationCross = () => {
        setText({color: 'white', text: '+'})
    }

    const renderPauseText = () => {
        setText({color: 'white', text: 'PAUSED'})
    }

    const value = { 
        textState, 
        setText,
        renderFixationCross,
        renderPauseText
    }

    return (
        <StroopTextContext.Provider value={ value }>
          	{children}
        </StroopTextContext.Provider>
	)
}