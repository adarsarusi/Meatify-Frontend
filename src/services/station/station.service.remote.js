import { httpService } from '../http.service'

export const stationService = {
    query,
    getById,
    getByIds,
    save,
    remove,
    addSongToStation,
    removeSongFromStation,
}

async function query() {
    return httpService.get(`station`)
}

function getById(stationId) {
    return httpService.get(`station/${stationId}`)
}

async function getByIds(stationIds) {
    return httpService.post("station/getIds", { stationIds })
}

async function remove(stationId) {
    return httpService.delete(`station/${stationId}`)
}

async function addSongToStation(stationId, songId) {
    return httpService.put(`station/${stationId}/song`)
}

async function removeSongFromStation(stationId, songId) {
    return httpService.delete(`station/${stationId}/song/${songId}`)
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

