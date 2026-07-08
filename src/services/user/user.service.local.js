import { storageService } from '../async-storage.service'
import { saveToStorage, loadFromStorage, makeId, getRandomFromArr } from '../util.service'
import { stationService } from '../station/station.service.local'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const USER_STORAGE_KEY = 'userDB'
const SONG_STORAGE_KEY = 'songDB'
const STATION_STORAGE_KEY = 'stationDB'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
    generateDemoUsers,
    setDemoLoggedinUser,
}

async function getUsers() {
    const users = await storageService.query(USER_STORAGE_KEY)
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get(USER_STORAGE_KEY, userId)
}

function remove(userId) {
    return storageService.remove(USER_STORAGE_KEY, userId)
}

async function update(user) {
    const updatedUser = await storageService.put(
        USER_STORAGE_KEY,
        user
    )

    const loggedinUser = getLoggedinUser()

    if (loggedinUser?._id === updatedUser._id) {
        saveLoggedinUser(updatedUser)
    }

    return updatedUser
}

async function login(userCred) {
    const users = await storageService.query(USER_STORAGE_KEY)
    const user = users.find(user => user.username === userCred.username)

    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

    const user = await storageService.post(USER_STORAGE_KEY, userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {

    user = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        likedStationIds: user.likedStationIds || [],
        likedSongIds: user.likedSongIds || [],
    }

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

export async function generateDemoUsers(userCount) {
    let users = await loadFromStorage(USER_STORAGE_KEY)

    if (users?.length) return users

    users = Array.from({ length: userCount }, (_, i) => _generateUser(i))

    saveToStorage(USER_STORAGE_KEY, users)

    return users
}

export async function setDemoLoggedinUser() {
    let users = await loadFromStorage(USER_STORAGE_KEY)

    if (!users?.length) {
        users = await generateDemoUsers(50)
    }

    const demoUser = users[0]

    const alreadyHasLikedData = demoUser.likedSongIds?.length || demoUser.likedStationIds?.length

    if (!alreadyHasLikedData) {
        const allSongs = await loadFromStorage(SONG_STORAGE_KEY) || []
        const allStations = await loadFromStorage(STATION_STORAGE_KEY) || []
        const otherStations = allStations.filter(station => station._id !== 'likedSongs')
        const likedSongsStation = allStations.filter(station => station._id === 'likedSongs')

        const likedSongIds = allSongs.length
            ? getRandomFromArr(allSongs, Math.min(15, allSongs.length)).map(song => song._id)
            : []

        const likedStationIds = otherStations.length
            ? getRandomFromArr(otherStations, Math.min(10, otherStations.length)).map(station => station._id)
            : []

        if (!likedStationIds.includes('likedSongs')) {
            likedStationIds.unshift('likedSongs')
        }

        demoUser.likedSongIds = likedSongIds
        demoUser.likedStationIds = likedStationIds

        if (likedSongsStation[0]) {
            likedSongsStation[0].songs = allSongs.filter(song => likedSongIds.includes(song._id))
            await stationService.save(likedSongsStation[0])
        }

        const userIdx = users.findIndex(u => u._id === demoUser._id)
        if (userIdx !== -1) {
            users[userIdx] = demoUser
            await saveToStorage(USER_STORAGE_KEY, users)
        }
    }

    const user = {
        _id: demoUser._id,
        fullname: demoUser.fullname,
        username: demoUser.username,
        imgUrl: demoUser.imgUrl,
        likedStationIds: demoUser.likedStationIds,
        likedSongIds: demoUser.likedSongIds,
    }

    sessionStorage.setItem(
        STORAGE_KEY_LOGGEDIN_USER,
        JSON.stringify(user)
    )

    return user
}

function _generateUser(idx) {
    const firstNames = [
        'Will', 'Jordan', 'Casey', 'Morgan', 'Taylor',
        'Riley', 'Sam', 'Jamie', 'Drew', 'Quinn',
        'Blake', 'River', 'Phoenix', 'Sage', 'Storm',
        'Nova', 'Kai', 'Eden', 'Leo', 'Zara'
    ]

    const lastNames = [
        'Smooth', 'Johnson', 'Williams', 'Brown', 'Jones',
        'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson',
        'Anderson', 'Thomas', 'Moore', 'Jackson',
        'Martin', 'Lee'
    ]

    const firstName = firstNames[idx % firstNames.length]
    const lastName =
        lastNames[Math.floor(idx / firstNames.length) % lastNames.length]

    return {
        _id: makeId(),
        fullname: `${firstName} ${lastName}`,
        username: `user${idx}`,
        password: '123',
        imgUrl: `https://i.pravatar.cc/150?img=${idx}`,
        likedStationIds: [],
        likedSongIds: [],
    }
}