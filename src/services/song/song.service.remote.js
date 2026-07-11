import { httpService } from "../http.service"

export const songService = {
  query,
  getById,
  firstDemoSong,
  getArtistInfo,
}

async function query(filterBy = {}) {
  return await httpService.get(`song`, filterBy)
}

async function getById(songId) {
  return await httpService.get(`song/${songId}`)
}

async function getArtistInfo(songId) {
  return await httpService.get(`song/${songId}/artist`)
}

async function firstDemoSong() {
  return await httpService.get(`song/6a5264a3d42a508080216d17`)
}
