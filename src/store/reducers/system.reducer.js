export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const TOGGLE_EXPAND_LIBRARY = 'TOGGLE_EXPAND_LIBRARY'
export const TOGGLE_SQUARE_LIBRARY = 'TOGGLE_SQUARE_LIBRARY'
export const TOGGLE_OPEN_QUEUE = 'TOGGLE_OPEN_QUEUE'
export const TOGGLE_SHUFFLE_STATE = 'TOGGLE_SHUFFLE_STATE'

const initialState = {
  isLoading: false,
  isExpanded: false,
  isSquare: false,
  isShuffle: false,
  isQueueOpened: false,
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case TOGGLE_OPEN_QUEUE:
      return { ...state, isQueueOpened: action.isQueueOpened }
    case TOGGLE_SHUFFLE_STATE:
      return { ...state, isShuffle: action.isShuffle }
    case TOGGLE_EXPAND_LIBRARY:
      return { ...state, isExpanded: action.isExpanded }
    case TOGGLE_SQUARE_LIBRARY:
      return { ...state, isSquare: action.isSquare }
    default: return state
  }
}
