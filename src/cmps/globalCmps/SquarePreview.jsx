import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"

import { setQueue, setCurrentSong, setPlayingStation, toggleIsPlaying } from "../../store/actions/player.actions.js"
import { useLocation, useNavigate } from "react-router-dom"
import { formatArtists } from "../../services/util.service"
import { useSelector } from "react-redux"
import { useMemo } from "react"
import { TOGGLE_IS_SHUFFLE } from "../../store/reducers/player.reducer.js"
import { store } from "../../store/store.js"

export function SquarePreview({ station, hover = true, isLibrary = false }) {
  const location = useLocation()
  const navigate = useNavigate()

  const currPlayingStation = useSelector((storeState) => storeState.playerModule.currPlayingStation)
  const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)
  const songs = useSelector((storeState) => storeState.songModule.songs) || []
  const loggedinUser = useSelector(storeState => storeState.userModule.user)

  const isLikedSongsStation = station?.tags?.includes("Liked")
  const isCurrStationPlaying = currPlayingStation?._id === station?._id
  const isSelectedStation = location.pathname === `/station/${station?._id}`

  const songCount = loggedinUser?.likedSongIds?.length || 0

  const likedSongIds = loggedinUser?.likedSongIds || []
  const stationSongsIds = station?.songs || []

  const stationSongs = useMemo(() => {
    const songIds = isLikedSongsStation ? likedSongIds : stationSongsIds
    if (!songIds.length) return []
    return songIds
      .map(songId => songs.find(song => song._id.toString() === songId))
      .filter(Boolean)
  }, [songs, station?.songs, likedSongIds, isLikedSongsStation])

  const rawArtists = [...new Set(stationSongs.flatMap((song) => formatArtists(song)))]

  const displayArtists = rawArtists.length > 3
    ? [...rawArtists.slice(0, 3), "and More"].join(", ")
    : rawArtists.join(", ")

  const onPlayStation = (e) => {
    e.stopPropagation()
    if (isCurrStationPlaying) {
      toggleIsPlaying()
    } else {
      setQueue(stationSongs)
      store.dispatch({ type: 'TOGGLE_IS_SHUFFLE', isShuffle: false })
      setPlayingStation(station)
      if (stationSongs.length > 0) {
        setCurrentSong(stationSongs[0])
      }
    }
  }

  if (!station) return null

  return (
    <article
      className={`entity-square-preview__item 
      ${isSelectedStation && isLibrary ? 'entity-square-preview__item--active' : ''} 
      ${isCurrStationPlaying && isPlaying ? 'entity-square-preview__item--playing' : ''}`.trim()}
      onClick={() => navigate(`/station/${station._id}`)}
    >
      <div className="entity-square-preview__meta">
        <div className="entity-square-preview__img">
          <StationCover entity={station} />

          <button
            className="btn play-btn red-btn entity-square-preview__btn"
            onClick={onPlayStation}
          >
            {isCurrStationPlaying && isPlaying ? (
              <IconComp name="pause" className="icon--white icon--resizable" />
            ) : (
              <IconComp name="play" className="icon--white icon--resizable" />
            )}
          </button>
        </div>

        <div className="entity-square-preview__meta-text">
          <div className={`entity-square-preview__title ${isCurrStationPlaying && isPlaying ? "playing-song" : ""} ellipsis-text`}>
            {station.title || station.name}
          </div>

          {isLikedSongsStation ? (
            <p className='station-preview__song-length ellipsis-text'>{songCount} songs</p>
          ) : (
            <div className="entity-square-preview__artists ellipsis-text">{displayArtists}</div>
          )}
        </div>
      </div>
    </article>
  )
}