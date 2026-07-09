import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"

import { setQueue, setCurrentSong } from "../../store/actions/player.actions"
import { useNavigate } from "react-router-dom"
import { formatArtists } from "../../services/util.service"


export function SquarePreview({ entity, hover = true }) {

  const type = entity.type

  const navigate = useNavigate()

  // Flats Artist names form songs to usable string
  const rawArtists =
    type === "station"
      ? [...new Set(entity.songs.flatMap((song) => formatArtists(song)))]
      : entity.artists || []

  const displayArtists =
    rawArtists.length > 3
      ? [...rawArtists.slice(0, 3), "and More"].join(", ")
      : rawArtists.join(", ")

  return (
    <article className="entity-square-preview__item" onClick={() => type === "station" && navigate(`/${type}/${entity._id}`)} >
      <div className="entity-square-preview__meta">
        <div className="entity-square-preview__img">
          <StationCover entity={entity} />
          <button
            className="btn play-btn green-btn entity-square-preview__btn"
            onClick={() => {
              setQueue(entity.songs)
              setCurrentSong(entity.songs[0])
            }}
          >
            <IconComp name="play" className="icon--resizable" />
          </button>
        </div>
        <div className="entity-square-preview__meta-text ">
          <div className="entity-square-preview__title ellipsis-text ">
            {entity.title || entity.name}
          </div>
          <div className="entity-square-preview__artists ellipsis-text ">{displayArtists}</div>
        </div>
      </div>
    </ article>
  )
}
