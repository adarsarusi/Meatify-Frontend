import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

import { IconComp } from "./IconComp"
import { EqPlayIconAnimation } from "./EqPlayIconAnimation"

import { LikeBtn } from "../LikeBtn"
import { StationCover } from "./StationCover"
import {
  setCurrentSong,
  toggleIsPlaying,
} from "../../store/actions/player.actions"
import {
  addSongToStation,
  removeSongFromStation,
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

  const navigate = useNavigate()

  function formatTime(seconds = 0) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  function navigateToSong(ev) {
    ev.preventDefault()
    navigate(`/song/${song._id}`)
  }

  return (
    <section aria-label={song.title} className="song-preview__item">
      <div className="song-preview__play">

        {isCurrentSong && isPlaying ? <EqPlayIconAnimation /> :
          <p className="song-preview__index">{index}</p>}
        <button

          className="song-preview__btn song-preview__btn--play"
          onClick={() => {
            if (isCurrentSong) {
              toggleIsPlaying()
            } else {
              setCurrentSong(song)
            }
          }}
        >
          {isCurrentSong && isPlaying ? (
            <IconComp name="pause" className="icon--white icon-no-padding" />
          ) : (
            <IconComp name="play" className="icon--white icon-no-padding" />
          )}
        </button>
      </div>

      <div className="song-preview__meta">
        <StationCover entity={song} />
        <div className="song-preview__meta-text">
          <div
            className={`song-preview__title ${(isCurrentSong && isPlaying) ? "playing-song" : ""} ellipsis-text `}
          >
            {song.title}
          </div>
          <div className="song-preview__artists ellipsis-text">
            {(song.artists || []).map(artist => artist.name).join(", ")}
          </div>
        </div>
      </div>

      <div className="song-preview__album ellipsis-text">{song.album}</div>

      <div className="song-preview__date ellipsis-text">28/06/26</div>

      <div className="song-preview__actions">
        <div className="song-preview__btn song-preview__btn--like">
          <LikeBtn itemId={song._id} userField="likedSongIds" />
        </div>

        <div className="song-preview__duration">
          {formatTime(song.duration)}
        </div>

        <button
          className="song-preview__btn song-preview__btn--more"
          onClick={() => setIsMenuOpen(true)}
          onBlur={() => setIsMenuOpen(false)}
        >
          <IconComp name="more" className="icon--white" />
          {isMenuOpen && (
            <div className="song-preview__context-menu">
              {isSongInStation ? (
                <span onMouseDown={() => removeSongFromStation(station._id, song._id)}>
                  Remove from playlist
                </span>
              ) : (
                <span onMouseDown={() => addSongToStation(station._id, song._id)}>
                  Add to playlist
                </span>
              )}
            </div>
          )}
        </button>
      </div>
    </section >
  )
}

export default SongPreview
