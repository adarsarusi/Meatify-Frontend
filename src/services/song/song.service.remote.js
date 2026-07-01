import { storageService } from '../async-storage.service'

const SONG_STORAGE_KEY = 'songDB'

export const songService = {
    query,
    getById,
}

async function query() {
    return await storageService.query(SONG_STORAGE_KEY)
}

async function getById(songId) {
    return await storageService.get(SONG_STORAGE_KEY, songId)
}