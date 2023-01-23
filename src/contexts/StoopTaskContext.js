import { createContext, useContext, useReducer } from "react";
import stroopTrialReducer, { INITIAL_STATE as initialTrialState } from "../reducers/stroopTrialReducer";

export const StroopTaskContext = createContext(initialTrialState)

export function useStroop() {
    return useContext(StroopTaskContext)
  }

export function StroopTaskProvider({ children }) {

    // Reducers
    const [state, dispatch] = useReducer(stroopTrialReducer, initialTrialState),
        { date, startTime, endTime, practiceRounds, finalRounds, totalCongruent, totalCorrect } = state
    
    const newTrial = () => {
        
    }

    // Trial Reducer Methods
    const pushTrial = (trial) => {
        dispatch({
            type: 'PUSH_TRIAL',
            payload: trial
        })
    }

    const value = { 
        pushTrial,

    }

    return (
        <StroopTaskContext.Provider value={ value }>
          	{children}
        </StroopTaskContext.Provider>
	)
}
