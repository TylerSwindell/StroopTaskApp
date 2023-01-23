export const INITIAL_STATE = {
    pid: null,
    signupDate: null,
    listOfTrials: [ ],
}

export function userDataReducer(state, action) {
    const {type, payload} = action

    switch(type) {
        case 'NEW_SESSION':
            return {    
                pid: payload,
                listOfTrials: [ ]
            }
        case 'PUSH_TRIAL':
            const listOfTrials = state.listOfTrials.push(payload)
            return {    
                ...state,
                listOfTrials
            }
        default: throw new Error(`No case for type ${type}`)
    }
}