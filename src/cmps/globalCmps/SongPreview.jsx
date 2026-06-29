import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import { IconComp } from "./IconComp"

import { LikeBtn } from "../LikeBtn"
import { StationCover } from "./StationCover"
import {
  setCurrentSong,
  toggleIsPlaying,
} from "../../store/actions/player.actions"

import {
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../../store/actions/station.actions"

export function SongPreview({ song, index }) {
  const currentSong = useSelector(
    (storeState) => storeState.playerModule.currentSong,
  )
  const isPlaying = useSelector(
    (storeState) => storeState.playerModule.isPlaying,
  )
  const station = useSelector(
    (storeState) => storeState.stationModule.selectedStation,
  )

  const isCurrentSong = currentSong?._id === song._id
  const isSongInStation = station?.songs?.some((s) => s._id === song._id)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  console.log(isMenuOpen)

  const navigate = useNavigate()

  function formatTime(seconds = 0) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  function navigateToSong(ev) {
    // Added z-index to song title because something sits above it and it prevents clicking on it
    //  - need to fix and remove z-index.
    navigate(`/song/${song._id}`)
  }

  return (
    <article className="song-preview__item">
      <p
        className={`song-preview__index ${isCurrentSong ? "playing-song" : ""}`}
      >
        {index}
      </p>

      <div className="song-preview__meta">
        <StationCover entity={song} />

        <div className="song-preview__meta-text">
          <div
            className={`song-preview__title ${isCurrentSong ? "playing-song" : ""}`}
            style={{ cursor: "pointer", zIndex: 10 }}
            onClick={navigateToSong}
          >
            {song.title}
          </div>
          <div className="song-preview__artists">
            {(song.artists || []).join(", ")}
          </div>
        </div>
      </div>
      <div className="song-preview__controls">
        <button
          className="song-preview__btn song-preview__btn--play btn-reset"
          onClick={() => {
            if (isCurrentSong) {
              toggleIsPlaying()
            } else {
              setCurrentSong(song)
            }
          }}
        >
          {isCurrentSong && isPlaying ? (
            <IconComp name="pause" className="icon--white" />
          ) : (
            <IconComp name="play" className="icon--white" />
          )}
        </button>
        <div className="song-preview__btn song-preview__btn--like">
          <LikeBtn itemId={song._id} userField="likedSongIds" />
        </div>
        <button
          className="song-preview__btn song-preview__btn--more  btn-reset"
          onClick={() => setIsMenuOpen(true)}
          onBlur={() => setIsMenuOpen(false)}
        >
          <IconComp name="more" className="icon--white" />
          {isMenuOpen && (
            <div className="song-preview__context-menu">
              {isSongInStation ? (
                <span
                  onMouseDown={() => removeSongFromPlaylist(station, song)}
                >
                  Remove from playlist
                </span>
              ) : (
                <span onMouseDown={() => addSongToPlaylist(station, song)}>
                  Add to playlist
                </span>
              )}
            </div>
          )}
        </button>
      </div>
      <div className="song-preview__duration">{formatTime(song.duration)}</div>
    </article>
  )
}

export default SongPreview
