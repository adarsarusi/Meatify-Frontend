import { songService } from '../../services/song'
import { stationService } from '../../services/station'
import { store } from '../store'

import { SET_SONGS, UPDATE_SONGS } from '../reducers/song.reducer'
import { LOADING_START, LOADING_DONE } from "../reducers/system.reducer.js"

export async function loadSongs(filterBy = {}) {
    store.dispatch({ type: LOADING_START })
    try {
        let songs = await songService.query(filterBy)
        store.dispatch(getCmdGetSongs(songs))
        return songs
    } catch (err) {
        console.error('Cannot load songs', err)
        throw err
    }
    finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

function getCmdGetSongs(songs) {
    return {
        type: SET_SONGS,
        songs,
    }
}
