export const SET_SONGS = 'SET_SONGS'
export const UPDATE_SONGS = 'UPDATE_SONGS'
export const SET_SEARCH_SONGS = 'SET_SEARCH_SONGS'

const initialState = {
    songs: [],
    searchSongs: [],
}

export function songReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_SONGS:
            return {
                ...state,
                songs: action.songs,
            }

        case SET_SEARCH_SONGS:
            return {
                ...state,
                searchSongs: action.songs,
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