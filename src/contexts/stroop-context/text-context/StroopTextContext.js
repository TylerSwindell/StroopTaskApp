import { createContext, useContext, useReducer } from "react";
import stroopTextReducer, { INITIAL_STATE as initialTextState } from "../../../reducers/stroopTextReducer";
import { STROOP_TEXT } from "../../../config/actionTypes";

const { SET_STROOP_TEXT } = STROOP_TEXT

export const StroopTextContext = createContext(initialTextState)
export const useStroopText = () => useContext(StroopTextContext)

export function StroopTextProvider({ children }) {

    // Reducers
		const [state, dispatch] = useReducer(stroopTextReducer, initialTextState)

    // Text Reducer Methods
    const setText = ({color, text}) => {
        dispatch({
            type: SET_STROOP_TEXT,
            payload: {color, text}
        })
    }

    const value = { 
        stroopText: {...state}, 
        setText,
    }

    return (
        <StroopTextContext.Provider value={ value }>
          	{children}
        </StroopTextContext.Provider>
	)
}