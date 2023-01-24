import { STROOP_TEXT } from "../config/actionTypes"

const { SET_STROOP_TEXT } = STROOP_TEXT

export const INITIAL_STATE = {
    text: '',
    color: '',
    congruent: null
}

export default function stroopTextReducer(state, action) {
    const {type, payload} = action

    switch(type) {
        case SET_STROOP_TEXT: 
            const { text, color } = payload,
                congruent = (text.toLowerCase() === color.toLowerCase())

            return { text, color, congruent }
        
        default: throw new Error(`No case for type ${type}`)
    }
}