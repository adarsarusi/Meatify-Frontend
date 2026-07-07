export const SET_SONGS = 'SET_SONGS'
export const UPDATE_SONGS = 'UPDATE_SONGS'

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


        case UPDATE_SONGS:
            return {
                ...state,
                songs: state.songs.map(song =>
                    song._id === action.song._id
                        ? action.song
                        : song
                )
            }

        default:
            return state
    }
}