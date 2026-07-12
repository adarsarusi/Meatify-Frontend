import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"

import { setQueue, setCurrentSong, setPlayingStation, toggleIsPlaying } from "../../store/actions/player.actions.js"
import { useLocation, useNavigate } from "react-router-dom"
import { formatArtists } from "../../services/util.service"
import { useSelector } from "react-redux"
import { useEffect } from "react"

export function SquarePreview({ station, stationSongs, hover = true, isLibrary = false }) {


  const location = useLocation()
  const navigate = useNavigate()

  const selectedStation = useSelector((storeState) => storeState.stationModule.selectedStation)
  const currPlayingStation = useSelector((storeState) => storeState.playerModule.currPlayingStation)
  const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)

  const isCurrStationPlaying = currPlayingStation?._id === station?._id
  const isLikedStation = !station.tags?.includes("Liked")

  const isSelectedStation = location.pathname === `/station/${station._id}`

  const loggedinUser = useSelector(
    storeState => storeState.userModule.user
  )

  const songCount = loggedinUser.likedSongIds.length

  // Flats Artist names form songs to usable string
  const rawArtists = [...new Set(stationSongs.flatMap((song) => formatArtists(song)))]

  const displayArtists =
    rawArtists.length > 3
      ? [...rawArtists.slice(0, 3), "and More"].join(", ")
      : rawArtists.join(", ")

  return (
    <article className={`entity-square-preview__item 
      ${isSelectedStation && isLibrary ? 'entity-square-preview__item--active' : ''}
      ${isCurrStationPlaying && isPlaying ? 'entity-square-preview__item--playing' : ''}
      `}
      onClick={() => navigate(`/station/${station._id}`)
      }
    >
      <div className="entity-square-preview__meta">
        <div className="entity-square-preview__img">
          <StationCover entity={station} />
          <button
            className="btn play-btn green-btn entity-square-preview__btn"
            onClick={(e) => {
              e.stopPropagation()
              if (isCurrStationPlaying) {
                toggleIsPlaying()
              } else {
                setQueue(stationSongs)
                setCurrentSong(stationSongs[0])
                setPlayingStation(station)
              }
            }}
          >
            {isCurrStationPlaying && isPlaying ? (
              <IconComp name="pause" className="icon--white icon--resizable" />
            ) : (
              <IconComp name="play" className="icon--white icon--resizable" />
            )}
          </button>
        </div>
        <div className="entity-square-preview__meta-text ">
          <div className={`entity-square-preview__title ${(isCurrStationPlaying && isPlaying) ? "playing-song" : ""} ellipsis-text `}>
            {station.title || station.name}
          </div>
          {isLikedStation && <div className="entity-square-preview__artists ellipsis-text ">{displayArtists}</div>}
          {!isLikedStation && <p className='station-preview__song-length ellipsis-text'>{songCount} songs</p>}
        </div>
      </div>
    </ article >
  )
}
