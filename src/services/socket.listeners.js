import {
  socketService,
  SOCKET_EVENT_STATION_CREATED,
  SOCKET_EVENT_STATION_REMOVED,
  SOCKET_EVENT_STATION_UPDATED,
} from "./socket.service.js"

import {
  removeStationFromStore,
  updateStationInStore,
  addStationToStore,
} from "../store/actions/station.actions"

let isInitialized = false

export function initSocketListeners() {
  if (isInitialized) return
  isInitialized = true

  socketService.on(SOCKET_EVENT_STATION_CREATED, onStationCreated)
  socketService.on(SOCKET_EVENT_STATION_REMOVED, onStationRemoved)
  socketService.on(SOCKET_EVENT_STATION_UPDATED, onStationUpdated)
}

export function destroySocketListeners() {
  socketService.off(SOCKET_EVENT_STATION_CREATED, onStationCreated)
  socketService.off(SOCKET_EVENT_STATION_REMOVED, onStationRemoved)
  socketService.off(SOCKET_EVENT_STATION_UPDATED, onStationUpdated)

  isInitialized = false
}

function onStationRemoved(stationId) {
  removeStationFromStore(stationId)
}

function onStationUpdated(station) {
  updateStationInStore(station)
}

function onStationCreated(station) {
  addStationToStore(station)
}
