import { storageService } from "../async-storage.service"

const SONG_STORAGE_KEY = "songDB"

export const songService = {
  query,
  getById,
      firstDemoSong,
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

function firstDemoSong() {
    return {
        addedAt: 1778089220183,
        album: 'Total Anarchy',
        artists: [
            'Skazi'
        ],
        duration: 424,
        durationLabel: '7:04',
        imgUrl: 'https://i.discogs.com/Rpko_4_ymgqHTeEdAIiNlO8rBV7hCPGc_l0oQngv-JM/rs:fit/g:sm/q:90/h:537/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTc0NTEx/NS0xMTU1NzU2MTAy/LmpwZWc.jpeg',
        previewUrl: 'https://cdnt-preview.dzcdn.net/api/1/1/b/7/f/0/b7fde7190f5f36f87350abc958dd5965.mp3?hdnea=exp=1782666790~acl=/api/1/1/b/7/f/0/b7fde7190f5f36f87350abc958dd5965.mp3*~data=user_id=0,application_id=42~hmac=edb1d627bf3e56b454867a3ad0dbc7893aef465aa7b4beeb48421e13d31bb73b',
        tags: [
            'Psytrance',
            'Electronic',
            'Classic'
        ],
        title: 'Hit \'N\' Run',
        type: 'song',
        url: 'https://www.youtube.com/watch?v=dY9s5sqgIno',
        youtubeId: 'dY9s5sqgIno',
        _id: 'skH1tR'
    }
}


async function getById(songId) {
  return await storageService.get(SONG_STORAGE_KEY, songId)
}
