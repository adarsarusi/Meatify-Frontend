export const LOADING_START = 'LOADING_START'
export const LOADING_DONE = 'LOADING_DONE'
export const TOGGLE_EXPAND_LIBRARY = 'TOGGLE_EXPAND_LIBRARY'

const initialState = {
  isLoading: false,
  isExpanded: false
}

export function systemReducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOADING_START:
      return { ...state, isLoading: true }
    case LOADING_DONE:
      return { ...state, isLoading: false }
    case TOGGLE_EXPAND_LIBRARY:
      return { ...state, isExpanded: action.isExpanded }
    default: return state
  }
}
