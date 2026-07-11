import { httpService } from '../http.service'

export const stationService = {
    query,
    getById,
    getByIds,
    save,
    remove,
    addSongToStation,
    removeSongFromStation,
    getLikedStation
}

async function query(filterBy = {}) {
    return httpService.get(`station`,filterBy)
}

function getById(stationId) {
    return httpService.get(`station/${stationId}`)
}

async function getByIds(stationIds) {
    return httpService.post('station/getIds', { stationIds })
}

async function remove(stationId) {
    return httpService.delete(`station/${stationId}`)
}

async function addSongToStation(stationId, songId) {
    return httpService.put(`station/${stationId}/song/${songId}`)
}

async function removeSongFromStation(stationId, songId) {
    return httpService.delete(`station/${stationId}/song/${songId}`)
}

async function getLikedStation() {
   return httpService.get('station/6a4ff07d47db264eea7790b8')
}



async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(`station/${station._id}`, station)
    } else {
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}

