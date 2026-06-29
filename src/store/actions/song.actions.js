import { songService } from '../../services/song/song.service.local'
import { store } from '../store'

import { SET_SONGS } from '../reducers/song.reducer'

export async function loadSongs(filterBy = {}) {
    try {
        let songs = await songService.query(filterBy)

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