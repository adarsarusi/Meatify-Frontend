import { storageService } from '../async-storage.service'
import { userService } from '../user'
import { saveToStorage, loadFromStorage, makeId, getRandomIntInclusive } from '../util.service'

const STATION_STORAGE_KEY = 'station'
const SONG_STORAGE_KEY = 'song'

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
    let stations = await storageService.query(STATION_STORAGE_KEY)
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
    return await storageService.get(STATION_STORAGE_KEY, stationId)
}

async function remove(stationId) {
    await storageService.remove(STATION_STORAGE_KEY, stationId)
}

async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await storageService.put(STATION_STORAGE_KEY, station)
    } else {
        const stationToSave = {
            name: station.name,
            tags: station.tags || [],
            songs: station.songs || [],
            createdBy: userService.getLoggedinUser(),
            savedCount: 0,
            createdAt: Date.now()
        }
        savedStation = await storageService.post(STATION_STORAGE_KEY, stationToSave)
    }
    return savedStation
}

async function addStationMsg(stationId, txt) {
    const station = await getById(stationId)
    if (!station.msgs) station.msgs = []
    station.msgs.push({
        id: makeId(),
        txt,
        by: userService.getLoggedinUser()
    })
    return await save(station)
}

export async function generateSpotifyData(songsCount = 381, stationsCount = 147) {
    await _initData(SONG_STORAGE_KEY, _generateSong, songsCount)
    await _initData(STATION_STORAGE_KEY, _generateStation, stationsCount)
}

async function _initData(key, generateFn, count) {
    var data = await loadFromStorage(key)
    if (data && data.length > 0) return

    data = await Promise.all(Array.from({ length: count }, (_, i) => generateFn(i)))
    await saveToStorage(key, data)
}

async function _generateSong(idx) {
    const terms = ['funk', 'rock', 'pop', 'jazz', 'hiphop']
    const term = terms[idx % terms.length]
    try {
        const res = await fetch(`https://api.deezer.com/search?q=${term}`)
        const json = await res.json()
        const track = json.data[idx % json.data.length]
        return {
            _id: makeId(),
            title: track.title,
            url: track.preview,
            imgUrl: track.album.cover_big,
            artists: [track.artist.name],
            addedAt: Date.now()
        }
    } catch (err) {
        return {
            _id: makeId(),
            title: 'Fallback Song',
            url: '',
            imgUrl: '',
            artists: ['Unknown'],
            addedAt: Date.now()
        }
    }
}

async function _generateStation(idx) {
    const names = ['Workout Mix', 'Chill Lofi', 'Deep Focus', 'Party Hits']
    
    // Pull the songs that were just generated in the previous step
    const allSongs = await loadFromStorage(SONG_STORAGE_KEY) || []
    const shuffledSongs = allSongs.sort(() => Math.random() - 0.5)
    const stationSongs = shuffledSongs.slice(0, 6)

    return {
        _id: makeId(),
        name: names[idx % names.length],
        tags: ['Funk', 'Happy'],
        savedCount: getRandomIntInclusive(381, 999),
        songs: stationSongs
    }
}