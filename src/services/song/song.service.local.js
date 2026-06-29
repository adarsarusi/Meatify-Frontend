import { storageService } from "../async-storage.service"

const SONG_STORAGE_KEY = "songDB"

export const songService = {
  query,
  getById,
}

async function query(filterBy = {}) {
  let songs = await storageService.query(SONG_STORAGE_KEY)

  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, "i")
    songs = songs.filter(
      (song) => regex.test(song.title) || regex.test(song.artists),
    )
  }

  return songs
}

async function getById(songId) {
  return await storageService.get(SONG_STORAGE_KEY, songId)
}
