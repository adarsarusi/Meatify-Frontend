import { songService } from '../../services/song'
import { store } from '../store'

import { SET_SONGS, UPDATE_SONGS } from '../reducers/song.reducer'

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


export async function saveSongStationId(song) {
    try {
        const savedSong = await songService.updateSongStation(song)
        store.dispatch(getCmdUpdateSong(savedSong))
        return savedSong
    } catch (err) {
        console.log("Cannot update song", err)
        throw err
    }
}
export async function removeSongStationId(song) {
    try {
        const savedSong = await songService.updateSongStation(song)
        store.dispatch(getCmdUpdateSong(savedSong))
        return savedSong
    } catch (err) {
        console.log("Cannot update song", err)
        throw err
    }
}


function getCmdUpdateSong(song) {
    return {
        type: UPDATE_SONGS,
        song,
    }
}

function getCmdGetSongs(songs) {
    return {
        type: SET_SONGS,
        songs,
    }
}
