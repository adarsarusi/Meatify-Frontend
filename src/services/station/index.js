const { DEV, VITE_LOCAL } = import.meta.env

import { stationService as local } from './station.service.local'
import { stationService as remote } from './station.service.remote'

function getEmptyStation() {
    return {
        _id: '',
        name: 'My Playlist',
        tags: [],
        songs: [],
        createdBy: null,
        savedCount: 0,
        songsImagesUrls: [],
        uploadImgUrl: '',
        songsImagesUrls: [],
        isPrivate: false,
        type: 'station'
    }
}

function getDefaultFilter() {
    return {
        txt: '',
        tags: [],
        genres: [],
        albums: [],
        artists: []
    }
}

const isLocal = VITE_LOCAL === 'true'
const service = isLocal ? local : remote

if (isLocal) {
    service.generateSpotifyData(200, 100)
}
export const stationService = { getEmptyStation, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stationService = stationService
