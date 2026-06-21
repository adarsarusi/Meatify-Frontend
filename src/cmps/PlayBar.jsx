import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { toggleIsPlaying } from "../store/actions/player.actions.js"

import { formatTime } from "../services/util.service.js"

import ReactPlayer from "react-player"

export function PlayBar() {
  // const currentSong = useSelector((state) => state.playerModule.currentSong)
  const isPlaying = useSelector((state) => state.playerModule.isPlaying)
  const audioRef = useRef(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  // Used to test if player is working - Need to fix api url's (date issue)
  const currentSong = {
    title: "Hit and Run",
    artists: ["Skazi"],
    url: "https://www.youtube.com/watch?v=FvHjjhnslNg",
  }

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
    console.log(currentSong)
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

  return (
    <div className="player-container">
      <div className="song-info-placeholder">
        {/* image to be added later.*/}
        <a className="player-song-title">{currentSong.title}</a>
        <div className="player-song-artists">
          {(currentSong.artists || []).join(", ")}
        </div>
      </div>

      <div className="center-control">
        <div className="main-buttons">
          <button className="shuffle-song-btn playbar-btn">
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
              <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path>
              <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.947l-1.017-1.018a.75.75 0 1 1 1.06-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06L13.109 13H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.938z"></path>
            </svg>
          </button>
          <button className="previous-song-btn playbar-btn">
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
              <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7z"></path>
            </svg>
          </button>
          <button className="playpause-btn " onClick={onTogglePlay}>
            {isPlaying ? (
              <svg className="play-btn" viewBox="0 0 16 16">
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path>
              </svg>
            ) : (
              <svg className="play-btn" viewBox="0 0 16 16">
                <path d="M3 1.713a.7.7 0 0 1 .7-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288z"></path>
              </svg>
            )}
          </button>
          <button className="next-song-btn playbar-btn">
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
              <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7z"></path>
            </svg>
          </button>
          <button className="repeat-song-btn playbar-btn">
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
              <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L6.939 12.75l2.829-2.828a.75.75 0 1 1 1.06 1.06L9.811 12h2.439a2.25 2.25 0 0 0 2.25-2.25v-5a2.25 2.25 0 0 0-2.25-2.25h-8.5A2.25 2.25 0 0 0 1.5 4.75v5A2.25 2.25 0 0 0 3.75 12H5v1.5H3.75A3.75 3.75 0 0 1 0 9.75z"></path>
            </svg>
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
            onEnded={onTogglePlay}
          />
          <span className="remaining-time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="volume-container">
        <button className="volume-icon-btn playbar-btn" onClick={onToggleMute}>
          {isMuted ? (
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
              <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06"></path>
              <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.64 3.64 0 0 0-1.33 4.967 3.64 3.64 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.7 4.7 0 0 1-1.5-.694v1.3L2.817 9.852a2.14 2.14 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694z"></path>
            </svg>
          ) : (
            <svg className="playbar-svg-sizes" viewBox="0 0 16 16">
              <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.64 3.64 0 0 1-1.33-4.967 3.64 3.64 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.14 2.14 0 0 0 0 3.7l5.8 3.35V2.8zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a3 3 0 0 1 0 5.175z"></path>
            </svg>
          )}
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

      <div style={{ display: "none" }}>
        <ReactPlayer
          ref={audioRef}
          src={currentSong?.url}
          playing={isPlaying}
          onDurationChange={onSetDuration}
          onTimeUpdate={onSetCurrentTime}
          volume={isMuted ? 0 : volume}
          muted={isMuted}
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
