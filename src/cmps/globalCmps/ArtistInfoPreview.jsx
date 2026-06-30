import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"

import { setQueue, setCurrentSong } from "../../store/actions/player.actions"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { SquarePreview } from "./SquarePreview"
import SongList from "./SongList"



export function ArtistInfoPreview({ entity }) {

  const type = entity.type

  const navigate = useNavigate()

  const songs = useSelector(
    storeState => storeState.songModule.songs
  )

  const filteredSongs = songs.filter(song =>
    song.artists[0].toLowerCase() === entity.artists[0].toLowerCase()
  )


  const rawArtists =
    type === "station"
      ? [...new Set(entity.songs.flatMap((song) => song.artists))]
      : entity.artists || []

  const displayArtists =
    rawArtists.length > 3
      ? [...rawArtists.slice(0, 3), "and More"].join(", ")
      : rawArtists.join(", ")


  return (
    <section className="entity-artist-preview__item" onClick={() => navigate(`/${type}/${entity._id}`)} >
      <div className="entity-artist-preview__meta">
        <div className="entity-artist-preview__artist">
          {entity.artists[0] || entity.name}
        </div>

        <div className="entity-artist-preview__img">
          <StationCover entity={entity} />
        </div>
        <div className="entity-artist-preview__meta-text">
          <div className="entity-artist-preview__title">
            {entity.title || entity.name}
          </div>
          <div className="entity-artist-preview__artists">{displayArtists}</div>
        </div>
          <h2>More Songs:</h2>
          {/* <SongList songs={filteredSongs} /> */}
      </div>
    </ section>
  )
}
