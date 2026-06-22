import { store } from "../store.js"

import { SET_CURRENT_SONG,ADD_TO_QUEUE,REMOVE_FROM_QUEUE,TOGGLE_IS_PLAYING } from "../reducers/player.reducer.js"

export function setCurrentSong(song) {
  try {
    store.dispatch({ type: SET_CURRENT_SONG, song })
    
  } catch (err) {
    console.log("Cannot set current song.", err)
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
