import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"

import { setQueue, setCurrentSong } from "../../store/actions/player.actions"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { SquarePreview } from "./SquarePreview"
import { QueuePreview } from "../QueuePreview"


export function ArtistInfoPreview({ currentSong }) {

  if (!currentSong) return

  const type = currentSong.type

  const navigate = useNavigate()

  const songs = useSelector(
    storeState => storeState.songModule.songs
  )

  const filteredSongs = songs.filter(song =>
    song.artists[0].toLowerCase() === currentSong.artists[0].toLowerCase()
  )


  const rawArtists =
    type === "station"
      ? [...new Set(currentSong.songs.flatMap((song) => song.artists))]
      : currentSong.artists || []

  const displayArtists =
    rawArtists.length > 3
      ? [...rawArtists.slice(0, 3), "and More"].join(", ")
      : rawArtists.join(", ")




  return (
    <section className="entity-artist-preview__item">
      <div className="entity-artist-preview__meta">
        <div className="entity-artist-preview__artist">
          {currentSong.artists[0] || currentSong.name}
        </div>

        <div className="entity-artist-preview__img">
          <StationCover entity={currentSong} />
        </div>
        <div className="entity-artist-preview__meta-text">
          <div className="entity-artist-preview__title">
            {currentSong.title || currentSong.name}
          </div>
          <div className="entity-artist-preview__artists">{displayArtists}</div>
        </div>
        <div className="entity-artist-preview__description">
          <p classNam="entity-artist-preview__description-txt">{currentSong.description}</p>
        </div>
        <div className="entity-artist-preview__song-list">
          <h2>More Songs:</h2>
          <ul>
            {filteredSongs.map(song => (
              <QueuePreview key={song._id} song={song} />
            ))}
          </ul>
        </div>

      </div>
    </ section>
  )
}
