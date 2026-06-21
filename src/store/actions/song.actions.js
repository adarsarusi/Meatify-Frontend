import { songService } from '../../services/song/song.service.local'
import { store } from '../store'

import { SET_SONGS } from '../reducers/song.reducer'

export async function loadSongs() {
    try {
        const songs = await songService.query()

        store.dispatch({
            type: SET_SONGS,
            songs,
        })

        return songs
    } catch (err) {
        console.error('Cannot load songs', err)
        throw err
    }
}