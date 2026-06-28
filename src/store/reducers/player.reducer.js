export const SET_CURRENT_SONG = "SET_CURRENT_SONG"

export const SET_QUEUE = "SET_QUEUE"
export const ADD_TO_QUEUE = "ADD_TO_QUEUE"
export const REMOVE_FROM_QUEUE = "REMOVE_FROM_QUEUE"

export const TOGGLE_IS_PLAYING = "TOGGLE_IS_PLAYING"
export const SET_IS_PLAYING = "SET_IS_PLAYING"

const initialState = {
  currentSong: null,
  queue: [],
  isPlaying: false,
}
export function playerReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CURRENT_SONG:
      return { ...state, currentSong: action.song }

    case SET_QUEUE:
      return {
        ...state,
        queue: action.songs,
      }

    case ADD_TO_QUEUE:
      return {
        ...state,
        queue: [...state.queue, action.song],
      }

    case REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter((song) => song._id !== action.songId),
      }

    case TOGGLE_IS_PLAYING:
      return { ...state, isPlaying: !state.isPlaying }

    case SET_IS_PLAYING:
      return { ...state, isPlaying: action.isPlaying }

    default:
      return state
  }
}
