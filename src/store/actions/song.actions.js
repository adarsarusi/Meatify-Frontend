import { songService } from '../../services/song'
import { stationService } from '../../services/station'
import { store } from '../store'

import { SET_SONGS, SET_SEARCH_SONGS, UPDATE_SONGS } from '../reducers/song.reducer'

export async function loadSongs(filterBy = {}) {
    try {
        let songs = await songService.query(filterBy)
        store.dispatch(getCmdGetSongs(songs))
        return songs
    } catch (err) {
        console.error('Cannot load songs', err)
        throw err
    }

}

export async function loadSearchSongs(filterBy = {}) {
    try {
        const songs = await songService.query(filterBy)

        store.dispatch({
            type: SET_SEARCH_SONGS,
            songs,
        })

        return songs
    } catch (err) {
        console.error('Cannot load search songs', err)
        throw err
    }
}

function getCmdGetSongs(songs) {
    return {
        type: SET_SONGS,
        songs,
    }
}
