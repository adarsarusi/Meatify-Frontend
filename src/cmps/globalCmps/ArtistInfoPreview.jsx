import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"
import { stationService } from "../../services/station"

import { setQueue, setCurrentSong } from "../../store/actions/player.actions"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { SquarePreview } from "./SquarePreview"
import { QueuePreview } from "../QueuePreview"
import { useEffect, useState } from "react"

export function ArtistInfoPreview({ currentSong }) {
  const [artistInfo, setArtistInfo] = useState(null)
  const navigate = useNavigate()
  const songs = useSelector(storeState => storeState.songModule.songs)

  useEffect(() => {
    if (currentSong?.artists?.[0]?.name) {
      stationService.getArtistInfo(currentSong.artists[0].name).then(setArtistInfo)
    }
  }, [currentSong])

  if (!currentSong) return null
  if (!artistInfo) return null

  const { name, bio, monthlyListeners, imgUrl, fans } = artistInfo

  const shortBio = `${bio.slice(0, 100)} ...`

  console.log('shortBio: ', shortBio)

  const filteredSongs = songs.filter(song =>
    song.artists?.[0]?.name?.toLowerCase() === name.toLowerCase()
  )

  return (
    <section className="entity-artist-preview__item">
      <div className="entity-artist-preview__meta">
        <div className="entity-artist-preview__artist">
          {name}
        </div>

        <div className="entity-artist-preview__img">
          <StationCover entity={currentSong} />
        </div>
        <div className="entity-artist-preview__meta-text">
          <div className="entity-artist-preview__title">
            {name}
          </div>
          <div className="entity-artist-preview__artists">{name}</div>
        </div>
        <div className="entity-artist-preview__description">
          <p className="entity-artist-description__text">About the artist</p>
          <div className="entity-artist-description__image-container">
            <img className="entity-artist-description__pic" src={imgUrl} />
          </div>
          <div className="entity-artist-description__name">
            {name}
          </div>
          <p>{new Intl.NumberFormat('en-US').format(monthlyListeners)} Monthly Listeners </p>
          <p className="entity-artist-description__bio">{shortBio}</p>
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
    </section>
  )
}