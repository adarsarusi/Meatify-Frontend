import { storageService } from '../async-storage.service'
import { utilService } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'station'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg,
    generateSpotifyData
}
window.cs = stationService

async function query(filterBy = {}) {
    let stations = await storageService.query(STORAGE_KEY)
    const { txt, tags, genres, artists } = filterBy

    if (txt) {
        const regex = new RegExp(txt, 'i')
        stations = stations.filter(station =>
            regex.test(station.name) ||
            regex.test(station.tags?.join(' ')) ||
            regex.test(station.genres?.join(' ') || '') ||
            station.songs.some(song =>
                regex.test(song.title) ||
                (song.artists && song.artists.some(artist => regex.test(artist)))
            )
        )
    }

    if (tags && tags.length && !tags.includes('')) {
        stations = stations.filter(station =>
            tags.some(tag => station.tags.includes(tag))
        )
    }

    if (artists && artists.length && !artists.includes('')) {
        stations = stations.filter(station =>
            station.songs.some(song =>
                song.artists.some(artist => artists.includes(artist))
            )
        )
    }

    return stations
}

async function getById(stationId) {
    return await storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
    await storageService.remove(STORAGE_KEY, stationId)
}

async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await storageService.put(STORAGE_KEY, station)
    } else {
        const stationToSave = {
            name: station.name,
            tags: station.tags || [],
            songs: station.songs || [],
            createdBy: userService.getLoggedinUser(),
            savedCount: 0,
            createdAt: Date.now()
        }
        savedStation = await storageService.post(STORAGE_KEY, stationToSave)
    }
    return savedStation
}

async function addStationMsg(stationId, txt) {
    const station = await getById(stationId)
    if (!station.msgs) station.msgs = []
    station.msgs.push({
        id: utilService.makeId(),
        txt,
        by: userService.getLoggedinUser()
    })
    return await save(station)
}

export async function generateSpotifyData() {
    await _initData('song', _generateSong, 20)
    await _initData('station', _generateStation, 5)
    await _initData('user', _generateUser, 3)
}

async function _initData(key, generateFn, count) {
    var data = storageService.loadFromStorage(key)
    if (data && data.length > 0) return

    data = await Promise.all(Array.from({ length: count }, (_, i) => generateFn(i)))
    storageService.saveToStorage(key, data)
}

async function _generateSong(idx) {
    const terms = ['funk', 'rock', 'pop', 'jazz', 'hiphop']
    const term = terms[idx % terms.length]
    try {
        const res = await fetch(`https://api.deezer.com/search?q=${term}`)
        const json = await res.json()
        const track = json.data[idx % json.data.length]
        return {
            _id: utilService.makeId(),
            title: track.title,
            url: track.preview,
            imgUrl: track.album.cover_big,
            artists: [track.artist.name],
            addedAt: Date.now()
        }
    } catch (err) {
        return {
            _id: utilService.makeId(),
            title: 'Fallback Song',
            url: '',
            imgUrl: '',
            artists: ['Unknown'],
            addedAt: Date.now()
        }
    }
}

function _generateStation(idx) {
    const names = ['Workout Mix', 'Chill Lofi', 'Deep Focus', 'Party Hits']
    return {
        _id: utilService.makeId(),
        name: names[idx % names.length],
        tags: ['Funk', 'Happy'],
        savedCount: utilService.getRandomIntInclusive(381, 999),
        songs: []
    }
}

function _generateUser(idx) {
    return {
        _id: utilService.makeId(),
        fullname: `User ${749 + idx}`,
        imgUrl: `https://robohash.org/${idx}?set=set4`,
        likedStationIds: [],
        likedSongIds: []
    }
}