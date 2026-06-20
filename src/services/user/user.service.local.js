import { storageService } from '../async-storage.service'
import { saveToStorage, loadFromStorage, makeId } from '../util.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'
const USER_STORAGE_KEY = 'userDB'

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
    const users = await storageService.query('user')
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get('user', userId)
}

function remove(userId) {
    return storageService.remove('user', userId)
}

async function update({ _id }) {
    const user = await storageService.get('user', _id)
    await storageService.put('user', user)

    // When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)

    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

    const user = await storageService.post('user', userCred)
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
    }
    console.log('user: ', user)
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}


export async function generateDemoUsers(userIdx) {
    var data = await loadFromStorage('user')
    if (data && data.length > 0) return

    data = await Promise.all(Array.from({ length: userIdx }, (_, i) => _generateUser(i)))
    await saveToStorage(USER_STORAGE_KEY, data)
}

async function setDemoLoggedinUser() {
    const users = await loadFromStorage(USER_STORAGE_KEY) || []
    if (!users.length) return null

    const user = {
        _id: users[0]._id,
        fullname: users[0].fullname,
        username: users[0].username,
        imgUrl: users[0].imgUrl,
        likedStationIds: users[0].likedStationIds || [],
        likedSongIds: users[0].likedSongIds || [],
    }

    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function _generateUser(idx) {
    const firstNames = ['Alex', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Sam', 'Jamie', 'Drew', 'Quinn',
        'Blake', 'River', 'Phoenix', 'Sage', 'Storm', 'Nova', 'Kai', 'Eden', 'Leo', 'Zara']
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee']

    const firstName = firstNames[idx % firstNames.length]
    const lastName = lastNames[Math.floor(idx / firstNames.length) % lastNames.length]

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