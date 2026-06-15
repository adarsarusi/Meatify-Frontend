const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getEmptyUser() {
    return {
        username: '',
        password: '',
        email: '',
        fullname: '',
    }
}

const isLocal = VITE_LOCAL === 'true'
const service = isLocal ? local : remote

if (isLocal) {
    console.log('isLocal: ', isLocal)
    service.generateDemoUsers(100, 30)
}
export const userService = { ...service, getEmptyUser }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.userService = userService