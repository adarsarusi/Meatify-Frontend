export const SET_SONGS = 'SET_SONGS'

const initialState = {
    songs: [],
}

export function songReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_SONGS:
            return {
                ...state,
                songs: action.songs,
            }

        default:
            return state
    }
}