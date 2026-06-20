const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getEmptyUser() {
    return {
        username: '',
        password: '',
        email: '',
        fullname: '',
        imgUrl: '',
        likedStationIds: [],
        likedSongIds: [],
    }
}

const isLocal = VITE_LOCAL === 'true'
const service = isLocal ? local : remote

if (isLocal) {
    await service.setDemoLoggedinUser()
}

export const userService = { ...service, getEmptyUser }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.userService = userService