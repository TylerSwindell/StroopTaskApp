import STROOP_TEXT_ACTION_TYPES from "../config/action-types/stroopTextActionTypes"

const { SET_STROOP_TEXT } = STROOP_TEXT_ACTION_TYPES

export const INITIAL_STATE = {
    text: '+',
    color: 'white'
}

export default function stroopTextReducer(state, action) {
    const {type, payload} = action
    const {text, color} = payload

    switch(type) {
        case SET_STROOP_TEXT: 
            return {
                text,
                color
            }
        
        default: throw new Error(`No case for type ${type}`)
    }
}