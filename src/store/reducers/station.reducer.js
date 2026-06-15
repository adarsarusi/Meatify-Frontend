export const SET_STATIONS = 'SET_STATIONS'
export const SET_STATION = 'SET_STATION'
export const REMOVE_STATION = 'REMOVE_STATION'
export const ADD_STATION = 'ADD_STATION'
export const UPDATE_STATION = 'UPDATE_STATION'
export const ADD_STATION_MSG = 'ADD_STATION_MSG'

const initialStationState = {
    stations: [],
    lastWatchedStation: null,
    filterBy: { txt: '', tags: [], genres: [], artists: [] },
    isLoading: false
}

export function stationReducer(state = initialStationState, action = {}) {
    switch (action.type) {
        case SET_STATIONS:
            return { ...state, stations: action.stations }

        case SET_STATION:
            return { ...state, lastWatchedStation: action.station }

        case REMOVE_STATION:
            return {
                ...state,
                stations: state.stations.filter(station => station._id !== action.stationId)
            }

        case ADD_STATION:
            return {
                ...state,
                stations: [...state.stations, action.station]
            }

        case UPDATE_STATION:
            return {
                ...state,
                stations: state.stations.map(station =>
                    station._id === action.station._id ? action.station : station
                )
            }

        default:
            return state
    }
}