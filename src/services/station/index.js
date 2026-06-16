const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId } from '../util.service'

import { stationService as local } from './station.service.local'
import { stationService as remote } from './station.service.remote'

function getEmptyStation() {
    return {
        _id: '',
        name: '',
        tags: [],
        songs: [],
        createdBy: null,
        savedCount: 0
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
    service.generateSpotifyData(100, 30)
}
export const stationService = { getEmptyStation, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stationService = stationService
