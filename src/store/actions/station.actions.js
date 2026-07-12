import { stationService } from "../../services/station"
import { songService } from "../../services/song"
import { store } from "../store"
import {
  ADD_STATION,
  REMOVE_STATION,
  SET_STATIONS,
  SET_STATION,
  UPDATE_STATION,
  SET_STATION_LOADING,
} from "../reducers/station.reducer"

import { LOADING_START, LOADING_DONE } from "../reducers/system.reducer.js"

export async function loadStations(filterBy) {
  store.dispatch({ type: LOADING_START })
  try {
    const stations = await stationService.query(filterBy)

    store.dispatch(getCmdSetStations(stations))
  } catch (err) {
    console.log("Cannot load stations", err)
    throw err
  } finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

export async function loadStation(stationId) {
  store.dispatch({ type: LOADING_START })
  try {
    const station = await stationService.getById(stationId)
    store.dispatch(getCmdSetStation(station))
  } catch (err) {
    console.log("Cannot load station", err)
    throw err
  } finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

export async function removeStation(stationId) {
  store.dispatch({ type: LOADING_START })
  try {
    await stationService.remove(stationId)
    store.dispatch(getCmdRemoveStation(stationId))
  } catch (err) {
    console.log("Cannot remove station", err)
    throw err
  }

}

export async function addStation(station) {
  store.dispatch({ type: LOADING_START })
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdAddStation(savedStation))
    return savedStation
  } catch (err) {
    console.log("Cannot add station", err)
    throw err
  } finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

export async function updateStation(station) {
  store.dispatch({ type: LOADING_START })
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdUpdateStation(savedStation))
    return savedStation
  } catch (err) {
    console.log("Cannot save station", err)
    throw err
  }
  finally {
    store.dispatch({ type: LOADING_DONE })
  }
}


export async function addSongToStation(stationId, songId) {
  store.dispatch({ type: LOADING_START })
  try {
    const updatedStation = await stationService.addSongToStation(stationId, songId)
    store.dispatch(getCmdUpdateStation(updatedStation))
    return updatedStation
  } catch (err) {
    console.log("Cannot add song to station", err)
    throw err
  }
  finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

export async function removeSongFromStation(stationId, songId) {
  store.dispatch({ type: LOADING_START })
  try {
    const updatedStation = await stationService.removeSongFromStation(stationId, songId)
    store.dispatch(getCmdUpdateStation(updatedStation))
    return updatedStation
  } catch (err) {
    console.log("Cannot remove song from station", err)
    throw err
  }
  finally {
    store.dispatch({ type: LOADING_DONE })
  }
}

function getCmdSetStations(stations) {
  return {
    type: SET_STATIONS,
    stations,
  }
}

function getCmdSetStation(station) {
  return {
    type: SET_STATION,
    station,
  }
}

function getCmdRemoveStation(stationId) {
  return {
    type: REMOVE_STATION,
    stationId,
  }
}

function getCmdAddStation(station) {
  return {
    type: ADD_STATION,
    station,
  }
}

function getCmdUpdateStation(station) {
  return {
    type: UPDATE_STATION,
    station,
  }
}