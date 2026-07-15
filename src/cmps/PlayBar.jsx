import { useMediaQuery } from "react-responsive"
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
import { PlayingMarquee } from "./globalCmps/PlayingMarquee.jsx"

export function PlayBar() {
  const isMobile = useMediaQuery({ maxWidth: 768 })

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
        <div className="player-cover">
          <StationCover entity={currentSong} />
        </div>

        <div className="player-song-info">
          <PlayingMarquee className="player-song-title">
            {currentSong?.title}
          </PlayingMarquee>
          <PlayingMarquee className="player-song-artists">
            {formatArtists(currentSong)}
          </PlayingMarquee>
        </div>

        <div className="player-like-btn">
          <LikeBtn
            itemId={currentSong?._id}
            userField="likedSongIds"
            iconSize={`${isMobile ? 'icon--md' : 'icon--sm'}`}
          />
        </div>
      </div>

      <div className="center-control">
        <div className="main-buttons">
          <button
            className={`btn desktop-only ${isShuffle ? "no-hover" : ""} `}
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
            className="btn desktop-only"
            onClick={() => playPrevSong("prev")}
          >
            <IconComp name="previous-song" className="icon--muted icon--sm" />
          </button>

          <button className={`btn ${isMobile ? '' : 'play-btn play-bar__play-btn'}`}
            onClick={onTogglePlay}>
            <IconComp name={`${isPlaying ? 'pause' : 'play'}`}
              className={`${isMobile ? 'icon--white' : 'icon--black'} icon--md`} />
          </button>

          <button
            className="btn desktop-only"
            onClick={() => playNextSong("next")}
          >
            <IconComp name="next-song" className="icon--muted icon--sm" />
          </button>

          <button
            className={`btn desktop-only ${isRepeat ? "no-hover" : ""} `}
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
          <span className="elapsed-time desktop-only">
            {formatTime(currentTime)}

          </span>

          <div className="progress-track">

            <div
              className="progress-fill"
              style={{
                width: duration ? `${(currentTime / duration) * 100}%` : "0%",
              }}
            />

            <input
              type="range"
              min={0}
              max={duration}
              step={0.1}
              value={currentTime}
              onChange={handleProgressChange}
              className="progress-slider"
            />
          </div>

          <span className="remaining-time desktop-only">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      <div className="playbar-actions__container desktop-only">
        <button className={`btn desktop-only ${isQueueOpened ? 'no-hover' : ''} `} onClick={onToggleQueue}>
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
