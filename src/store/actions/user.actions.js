import { userService } from '../../services/user'
// import { socketService } from '../../services/socket.service.js'
import { store } from '../store'
import { showErrorMsg } from '../../services/event-bus.service'
import { REMOVE_USER, SET_USER, SET_USERS, SET_WATCHED_USER } from '../reducers/user.reducer'

import { LOADING_DONE, LOADING_START } from '../reducers/system.reducer'

export async function loadUsers() {
    store.dispatch({ type: LOADING_START })
    try {
        const users = await userService.getUsers()
        store.dispatch({ type: SET_USERS, users })
    } catch (err) {
        console.log('UserActions: err in loadUsers', err)
    } finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function removeUser(userId) {
    store.dispatch({ type: LOADING_START })
    try {
        await userService.remove(userId)
        store.dispatch({ type: REMOVE_USER, userId })
    } catch (err) {
        console.log('UserActions: err in removeUser', err)
    }
    finally {
        store.dispatch({ type: LOADING_DONE })
    }

}

export async function login(credentials) {
    store.dispatch({ type: LOADING_START })
    try {
        const user = await userService.login(credentials)
        store.dispatch({ type: SET_USER, user })
        socketService.login(user._id)
        return user
    } catch (err) {
        console.log('Cannot login', err)
        throw err
    }
    finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function signup(credentials) {
    store.dispatch({ type: LOADING_START })
    try {
        const user = await userService.signup(credentials)
        store.dispatch({ type: SET_USER, user })
        socketService.login(user._id)
        return user
    } catch (err) {
        console.log('Cannot signup', err)
        throw err
    }
    finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function logout() {
    store.dispatch({ type: LOADING_START })
    try {
        await userService.logout()
        store.dispatch({ type: SET_USER, user: null })
        socketService.logout()
    } catch (err) {
        console.log('Cannot logout', err)
        throw err
    }
    finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function loadUser(userId) {
    store.dispatch({ type: LOADING_START })
    try {
        const user = await userService.getById(userId)
        store.dispatch({ type: SET_WATCHED_USER, user })
    } catch (err) {
        showErrorMsg('Cannot load user')
        console.log('Cannot load user', err)
    }
    finally {
        store.dispatch({ type: LOADING_DONE })
    }
}

export async function updateUser(userToUpdate) {
    store.dispatch({ type: LOADING_START })
    try {
        const updatedUser = await userService.update(userToUpdate)

        store.dispatch({
            type: SET_WATCHED_USER,
            user: updatedUser
        })

        const loggedInUser = userService.getLoggedinUser()

        if (loggedInUser?._id === updatedUser._id) {
            store.dispatch({
                type: SET_USER,
                user: updatedUser
            })
        }

        return updatedUser
    } catch (err) {
        console.log('Cannot update user', err)
        throw err
    }
    finally {
        store.dispatch({ type: LOADING_DONE })
    }
}