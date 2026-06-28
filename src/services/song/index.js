const { DEV, VITE_LOCAL } = import.meta.env

import { songService as local } from './song.service.local'
import { songService as remote } from './song.service.remote'


const isLocal = VITE_LOCAL === 'true'
const service = isLocal ? local : remote

export const songService = { ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.songService = songService