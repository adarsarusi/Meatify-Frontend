import { store } from "../store.js"

import {
  SET_CURRENT_SONG,
  ADD_TO_QUEUE,
  REMOVE_FROM_QUEUE,
  TOGGLE_IS_PLAYING,
  SET_IS_PLAYING,
  SET_QUEUE,
  SET_PLAYING_STATION
} from "../reducers/player.reducer.js"

import { stationService } from "../../services/station"



export function setCurrentSong(song) {
  try {
    store.dispatch({ type: SET_CURRENT_SONG, song })
    store.dispatch({ type: SET_IS_PLAYING, isPlaying: true })
  } catch (err) {
    console.log("Cannot set current song.", err)
    throw err
  }
}

export function setQueue(songs) {
  try {
    store.dispatch({ type: SET_QUEUE, songs })
  } catch (err) {
    console.log("Cannot set the queue.", err)
    throw err
  }
}

export function addToQueue(song) {
  try {
    store.dispatch({ type: ADD_TO_QUEUE, song })
  } catch (err) {
    console.log("Cannot add to queue.", err)
    throw err
  }
}

export function removeFromQueue(songId) {
  try {
    store.dispatch({ type: REMOVE_FROM_QUEUE, songId })
  } catch (err) {
    console.log("Cannot set current song.", err)
    throw err
  }
}

export function toggleIsPlaying() {
  try {
    store.dispatch({ type: TOGGLE_IS_PLAYING })
  } catch (err) {
    console.log("Cannot toggle", err)
    throw err
  }
}

export async function setPlayingStation(currPlayingStation) {
  try {
    const station = await stationService.getById(currPlayingStation._id)

    const { _id, name } = station
    const stationInfo = { _id, name }
    store.dispatch({ type: SET_PLAYING_STATION, station: stationInfo })
  } catch (err) {
    console.log("Cannot load station", err)
    throw err
  }

}
