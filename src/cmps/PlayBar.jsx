import { useSelector } from "react-redux"
import { useState, useRef, useEffect } from "react"
import {
  setCurrentSong,
  setQueue,
  toggleIsPlaying,
  playNextSong,
  playPrevSong,
  toggleShuffleQueue,
} from "../store/actions/player.actions.js"

import { StationCover } from "./globalCmps/StationCover.jsx"

import { formatArtists, formatTime } from "../services/util.service.js"

import ReactPlayer from "react-player"
import { store } from "../store/store.js"

import { IconComp } from "./globalCmps/IconComp.jsx"
import { LikeBtn } from "./LikeBtn.jsx"

import { TOGGLE_OPEN_QUEUE } from "../store/reducers/system.reducer.js"

export function PlayBar() {
  const currentSong = useSelector((storeState) => storeState.playerModule.currentSong,)
  const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying,)
  const audioRef = useRef(null)

  const isQueueOpened = useSelector((storeState) => storeState.systemModule.isQueueOpened)
  const isShuffle = useSelector((storeState) => storeState.playerModule.isShuffle)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.2)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)



  function handleProgressChange(ev) {
    const newTime = +ev.target.value
    setCurrentTime(newTime)
    audioRef.current.currentTime = newTime
  }

  function handleVolumeChange(ev) {
    setVolume(+ev.target.value)
    if (isMuted) setIsMuted(false)
  }

  function onTogglePlay() {
    toggleIsPlaying()
  }

  function onSetDuration(ev) {
    setDuration(+ev.target.duration)
  }
  function onSetCurrentTime(ev) {
    setCurrentTime(+ev.target.currentTime)
  }

  function onToggleMute() {
    setIsMuted(!isMuted)
  }

  function onToggleQueue() {
    store.dispatch({ type: TOGGLE_OPEN_QUEUE, isQueueOpened: !isQueueOpened })
  }

  function onRepeat() {
    setIsRepeat(!isRepeat)
  }

  return (
    <div className="player-container">
      <div className="song-info-placeholder">
        <StationCover entity={currentSong} />
        <div>
          <a className="player-song-title ellipsis-text">
            {currentSong?.title}
          </a>
          <div className="player-song-artists ellipsis-text">
            {formatArtists(currentSong)}
          </div>
        </div>
        <LikeBtn itemId={currentSong?._id} userField="likedSongIds" iconSize="icon--sm" />
      </div>

      <div className="center-control">
        <div className="main-buttons">
          <button
            className={`btn ${isShuffle ? "no-hover" : ""} `}
            onClick={toggleShuffleQueue}
            title={isShuffle ? "Disable shuffle" : "Enable shuffle"}
          >
            <IconComp
              name="shuffle"
              className={isShuffle ? "icon--active icon--sm" : "icon--muted icon--sm"}
              isDot={isShuffle}
            />
          </button>

          <button
            className="btn"
            onClick={() => playPrevSong("prev")}
          >
            <IconComp name="previous-song" className="icon--muted icon--sm" />
          </button>

          <button className="btn play-btn play-bar__play-btn" onClick={onTogglePlay}>
            <IconComp name={`${isPlaying ? 'pause' : 'play'}`} className="icon--black" />
          </button>

          <button
            className="btn"
            onClick={() => playNextSong("next")}
          >
            <IconComp name="next-song" className="icon--muted icon--sm" />
          </button>

          <button
            className={`btn ${isRepeat ? "no-hover" : ""} `}
            onClick={onRepeat}
            title={isRepeat ? "Disable repeat" : "Enable repeat"}
          >
            <IconComp
              name="repeat"
              className={isRepeat ? "icon--active icon--sm" : "icon--muted icon--sm"}
              isDot={isRepeat}
            />
          </button>
        </div>

        <div className="progress-bar">
          <span className="elapsed-time">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            step={0.1}
            value={currentTime}
            onChange={handleProgressChange}
          />
          <span className="remaining-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="playbar-actions__container">
        <button className={`btn ${isQueueOpened ? 'no-hover' : ''} `} onClick={onToggleQueue}>
          <IconComp name="queue" className={`${isQueueOpened ? 'icon--active' : 'icon--muted'} icon--sm`} isDot={isQueueOpened} />
        </button>

        <div className="volume-container">

          <button className="volume" onClick={onToggleMute}>
            <IconComp name={`${isMuted ? 'volume-off' : 'volume'}`} className="icon--muted icon--sm" />
          </button>


          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            aria-valuetext="0:00"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-bar"
          ></input>
        </div>
      </div>

      <div style={{ display: "none" }}>
        <ReactPlayer
          ref={audioRef}
          src={currentSong?.url}
          playing={isPlaying}
          onDurationChange={onSetDuration}
          onTimeUpdate={onSetCurrentTime}
          volume={isMuted ? 0 : volume}
          muted={isMuted}
          loop={isRepeat}
          onEnded={() => {
            if (!isRepeat) playNextSong()
          }}
          config={{
            youtube: {
              playerVars: { autoplay: 0 },
            },
          }}
        />
      </div>
    </div>
  )
}
