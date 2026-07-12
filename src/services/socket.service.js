import io from "socket.io-client"
import { userService } from "./user"
const { VITE_LOCAL, DEV } = import.meta.env

export const SOCKET_EMIT_LOGIN = "set-user-socket"
export const SOCKET_EMIT_LOGOUT = "unset-user-socket"

export const SOCKET_EMIT_STATION_WATCH = "station-watch"
export const SOCKET_EMIT_STATION_UNWATCH = "station-unwatch"

export const SOCKET_EMIT_STATION_CREATED = "station-created"
export const SOCKET_EVENT_STATION_UPDATED = "station-updated"
export const SOCKET_EVENT_STATION_REMOVED = "station-removed"

export const SOCKET_EVENT_STATION_LIKED_COUNT_UPDATED =
  "station-liked-count-updated"

export const SOCKET_EVENT_STATION_SONG_ADDED = "station-song-added"
export const SOCKET_EVENT_STATION_SONG_REMOVED = "station-song-removed"
export const SOCKET_EVENT_STATION_SONGS_REORDERED = "station-songs-reordered"

export const SOCKET_EVENT_SONG_LIKED_COUNT_UPDATED = "song-liked-count-updated"

const baseUrl = process.env.NODE_ENV === "production" ? "" : "//localhost:3030"

export const socketService =
  VITE_LOCAL === "true" ? createDummySocketService() : createSocketService()

// for debugging from console

// if (DEV) window.socketService = socketService

socketService.setup()

function createSocketService() {
  var socket = null
  const socketService = {
    setup() {
      socket = io(baseUrl)
      const user = userService.getLoggedinUser()
      if (user) this.login(user._id)
    },
    on(eventName, cb) {
      if (!socket) return
      socket.on(eventName, cb)
    },
    off(eventName, cb = null) {
      if (!socket) return
      if (!cb) socket.removeAllListeners(eventName)
      else socket.off(eventName, cb)
    },
    emit(eventName, data) {
      if (!socket) return
      socket.emit(eventName, data)
    },
    login(userId) {
      if (!socket || !userId) return
      socket.emit(SOCKET_EMIT_LOGIN, userId)
    },
    logout() {
      if (!socket) return
      socket.emit(SOCKET_EMIT_LOGOUT)
    },
    watchStation(stationId) {
      if (!socket || !stationId) return
      socket.emit(SOCKET_EMIT_STATION_WATCH, stationId)
    },
    unwatchStation(stationId) {
      if (!socket || !stationId) return
      socket.emit(SOCKET_EMIT_STATION_UNWATCH, stationId)
    },

    terminate() {
      if (!socket) return
      socket.disconnect()
      socket = null
    },
  }
  return socketService
}

function createDummySocketService() {
  var listenersMap = {}
  const socketService = {
    listenersMap,
    setup() {
      listenersMap = {}
    },
    terminate() {
      this.setup()
    },
    login() {
      console.log("Dummy socket service here, login - got it")
    },
    logout() {
      console.log("Dummy socket service here, logout - got it")
    },
    on(eventName, cb) {
      listenersMap[eventName] = [...(listenersMap[eventName] || []), cb]
    },
    off(eventName, cb) {
      if (!listenersMap[eventName]) return
      if (!cb) delete listenersMap[eventName]
      else
        listenersMap[eventName] = listenersMap[eventName].filter(
          (l) => l !== cb,
        )
    },
    emit(eventName, data) {
      var listeners = listenersMap[eventName]
      if (!listeners) return

      listeners.forEach((listener) => {
        listener(data)
      })
    },
    // Functions for easy testing of pushed data
    testStationUpdated(station) {
      this.emit(SOCKET_EVENT_STATION_UPDATED, station)
    },
  }
  window.listenersMap = listenersMap
  return socketService
}

// Basic Tests
// function cb(x) {console.log('Socket Test - Expected Puk, Actual:', x)}
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('baba', cb)
// socketService.on('mama', cb)
// socketService.emit('baba', 'Puk')
// socketService.off('baba', cb)
