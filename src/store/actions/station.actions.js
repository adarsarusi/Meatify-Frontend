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

import { UPDATE_SONGS } from "../reducers/song.reducer"

export async function loadStations(filterBy) {
  store.dispatch({ type: "SET_STATION_LOADING", isLoading: true })
  try {
    const stations = await stationService.query(filterBy)
    store.dispatch(getCmdSetStations(stations))
  } catch (err) {
    console.log("Cannot load stations", err)
    throw err
  } finally {
    store.dispatch({ type: "SET_STATION_LOADING", isLoading: false })
  }
}

export async function loadStation(stationId) {
  store.dispatch({ type: "SET_STATION_LOADING", isLoading: true })
  try {
    const station = await stationService.getById(stationId)
    store.dispatch(getCmdSetStation(station))
  } catch (err) {
    console.log("Cannot load station", err)
    throw err
  } finally {
    store.dispatch({ type: "SET_STATION_LOADING", isLoading: false })
  }
}

export async function removeStation(stationId) {
  try {
    await stationService.remove(stationId)
    store.dispatch(getCmdRemoveStation(stationId))
  } catch (err) {
    console.log("Cannot remove station", err)
    throw err
  }
}

export async function addStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdAddStation(savedStation))
    return savedStation
  } catch (err) {
    console.log("Cannot add station", err)
    throw err
  }
}

export async function updateStation(station) {
  try {
    const savedStation = await stationService.save(station)
    store.dispatch(getCmdUpdateStation(savedStation))
    return savedStation
  } catch (err) {
    console.log("Cannot save station", err)
    throw err
  }
}

export async function addStationMsg(stationId, txt) {
  try {
    const msg = await stationService.addStationMsg(stationId, txt)
    store.dispatch(getCmdAddStationMsg(msg))
    return msg
  } catch (err) {
    console.log("Cannot add station msg", err)
    throw err
  }
}

export async function addSongToStation(stationId, songId) {
  try {
    const updatedSong = await songService.addSongStationId(songId)
    const addedSong = await stationService.addSongToStation(stationId, songId)
    await updateStation(addedSong)
    await updateSong(updatedSong)
  } catch (err) {
    console.log("Cannot add song to station", err)
    throw err
  }
}

export async function removeSongFromStation(stationId, songId) {
  try {
    const updatedSong = await songService.addSongStationId(songId)
    const removedSong = await stationService.removeSongFromStation(stationId, songId)
    await updateStation(removedSong)
    await updateSong(updatedSong)
  } catch (err) {
    console.log("Cannot remove song from station", err)
    throw err
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

function getCmdUpdateSong(song) {
  return {
    type: UPDATE_SONGS,
    song,
  }
}