import { httpService } from "../http.service"

export const songService = {
  query,
  getById,
  firstDemoSong,
  getArtistsInfo
}

async function query() {
  return await httpService.get()
}

async function getById(songId) {
  return await httpService.get(`song/${songId}`)
}

async function getArtistsInfo(songId,aritstName) {
  return await httpService.get(`song/${songId}/artists/`)
  
}

async function firstDemoSong() {
  return await httpService.get(`song/6a5264a3d42a508080216d17`)
}
