export const INITIAL_STATE = {
    loading: false,
    error: '',
    searchedUserPid: null,
    userData: null
}

export function userSearchReducer(state, action) {

    switch(action.type) {
        case "SEARCH_START":
            return {
                ...state,
                searchedUserPid: action.payload,
                loading: true
            }
        case "QUERY_DOC":
            return {
                ...state,
                userData: action.payload
            }
        case "ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload.error
            }
        case "LOADING_START":
            return {
                ...state,
                loading: true
            }
        case "LOADING_COMPLETE":
            return {
                ...state,
                loading: false
            }
        default: return INITIAL_STATE
    }
}