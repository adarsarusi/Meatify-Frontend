import React from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { IconComp } from "./IconComp"
import { EqPlayIconAnimation } from "./EqPlayIconAnimation"

import { LikeBtn } from "../LikeBtn"
import { StationCover } from "./StationCover"
import { formatArtists } from "../../services/util.service"
import {
  setCurrentSong,
  toggleIsPlaying,
} from "../../store/actions/player.actions"
import { SongContextMenu } from "./SongContextMenu"

export function SongPreview({ song, index }) {
  const navigate = useNavigate()

  const currentSong = useSelector(
    (storeState) => storeState.playerModule.currentSong,
  )
  const isPlaying = useSelector(
    (storeState) => storeState.playerModule.isPlaying,
  )

  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id: song._id })

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    touchAction: "none",
  }

  const isCurrentSong = currentSong?._id === song._id

  function formatTime(seconds = 0) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <section
      aria-label={song.title}
      className="song-preview__item"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div className="song-preview__play">
        {isCurrentSong && isPlaying ? <EqPlayIconAnimation /> :
          <p className="song-preview__index">{index}</p>}
        <button
          className="song-preview__btn song-preview__btn--play"
          onPointerDown={(ev) => ev.stopPropagation()}
          onClick={(ev) => {
            ev.stopPropagation()
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
            className={`song-preview__title ${(isCurrentSong && isPlaying) ? "playing-song" : ""} ellipsis-text`}
          >
            {song.title}
          </div>
          <div className="song-preview__artists ellipsis-text">
            {formatArtists(song)}
          </div>
        </div>
      </div>

      <div className="song-preview__album ellipsis-text">{song.album}</div>

      <div className="song-preview__date ellipsis-text">28/06/26</div>

      <div className="song-preview__actions">
        <div
          className="song-preview__btn song-preview__btn--like"
          onPointerDown={(ev) => ev.stopPropagation()}
        >
          <LikeBtn itemId={song._id} userField="likedSongIds" />
        </div>

        <div className="song-preview__duration">
          {formatTime(song.duration)}
        </div>

        <SongContextMenu song={song} />
      </div>
    </section>
  )
}

export default SongPreview