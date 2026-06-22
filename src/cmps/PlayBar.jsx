import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"
import { toggleIsPlaying } from "../store/actions/player.actions.js"
import { StationCover } from "./globalCmps/StationCover.jsx"

import { formatTime } from "../services/util.service.js"

import ReactPlayer from "react-player"
import { store } from "../store/store.js"
import { SET_CURRENT_SONG } from "../store/reducers/player.reducer.js"
import { IconComp } from "./globalCmps/IconComp.jsx"

export function PlayBar() {

  const stations = useSelector(storeState => storeState.stationModule.stations)
  const isLoading = useSelector(storeState => storeState.stationModule.isLoading)

  const currentSong = useSelector((storeState) => storeState.playerModule.currentSong)
  const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)
  const audioRef = useRef(null)

  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(0.2)
  const [isMuted, setIsMuted] = useState(false)

  // Used to test if player is working - Need to fix api url's (date issue)

  // Demo //
  useEffect(() => {
    if (stations && stations.length) {
      const demoSong = stations[0]?.songs[10]
      if (demoSong && !currentSong) {
        store.dispatch({ type: SET_CURRENT_SONG, song: demoSong })
      }
    }
  }, [stations, currentSong]) // Re-run if these change, though the if-statements protect it


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

  if (!isLoading && !currentSong) return <p>Loading...</p>


  return (
    <div className="player-container">
      <div className="song-info-placeholder">
        <StationCover entity={currentSong} />
        <div>
          <a className="player-song-title">{currentSong?.title}</a>
          <div className="player-song-artists">
            {(currentSong?.artists || []).join(", ")}
          </div>
        </div>
      </div>

      <div className="center-control">
        <div className="main-buttons">
          <button className="shuffle-song-btn playbar-btn icon-btn">
            <IconComp name='shuffle' className="icon--muted" />
          </button>
          <button className="previous-song-btn playbar-btn icon-btn">
            <IconComp name='previous-song' className="icon--muted" />
          </button>
          <button className="playpause-btn " onClick={onTogglePlay}>
            {isPlaying ? (
              <IconComp name='pause' className="icon--black" />
            ) : (
              <IconComp name='play' className="icon--black" />
            )}
          </button>
          <button className="next-song-btn playbar-btn icon-btn">
            <IconComp name='next-song' className="icon--muted" />
          </button>
          <button className="repeat-song-btn playbar-btn">
            <IconComp name='repeat' className="icon--muted" />
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
            <IconComp name='volume-off' className="icon--muted" />
          ) : (
            <IconComp name='volume' className="icon--muted" />
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
