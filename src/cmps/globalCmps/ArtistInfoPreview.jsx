import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"
import { stationService } from "../../services/station"
import { songService } from "../../services/song"

import { setQueue, setCurrentSong } from "../../store/actions/player.actions"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { SquarePreview } from "./SquarePreview"
import { QueuePreview } from "../QueuePreview"
import { useEffect, useState } from "react"
import { ScrollArea } from "./ScrollArea"


export function ArtistInfoPreview({ currentSong }) {
  const [artistInfo, setArtistInfo] = useState(null)
  const navigate = useNavigate()

  const songs = useSelector(storeState => storeState.songModule.songs)
  const currPlayingStation = useSelector(storeState => storeState.playerModule.currPlayingStation)

  useEffect(() => {
    if (currentSong?.artists?.[0]?.name) {
      songService.getArtistInfo(currentSong._id,currentSong.artists[0].name).then(setArtistInfo)
    }
  }, [currentSong])

  if (!currentSong) return null
  if (!artistInfo) return null

  const { name, bio, monthlyListeners, imgUrl, fans } = artistInfo
  
  const shortBio = `${bio.slice(0, 95)} ...`

  const filteredSongs = songs.filter(song =>
    song.artists?.[0]?.name?.toLowerCase() === name.toLowerCase()
  )

  return (

    <section className="entity-artist-preview__item">
      <ScrollArea>
        <div className="entity-artist-preview__meta">
          <div className="entity-artist-preview__station-name">
            {currPlayingStation?.name}
          </div>

          <div className="entity-artist-preview__img">
            <StationCover entity={currentSong} />
          </div>
          <div className="entity-artist-preview__meta-text">
            <div className="entity-artist-preview__song-title ellipsis-text">
              {currentSong?.title}
            </div>
            <div className="entity-artist-preview__artists ellipsis-text">{name}</div>
          </div>
          <div className="entity-artist-preview__description">
            <div className="entity-artist-description__image-container">
              <p className="entity-artist-description__text">About the artist</p>
              <img className="entity-artist-description__pic" src={imgUrl} />
            </div>
            <div className="entity-artist-preview__description-meta">
              <div className="entity-artist-description__name">
                <p>{name}</p>
                <IconComp name="verified" className="icon--lightgreen" />
              </div>
              <p>{new Intl.NumberFormat('en-US').format(monthlyListeners)} Monthly Listeners </p>
              <p className="entity-artist-description__bio">{shortBio}</p>
            </div>
          </div>
          {(filteredSongs.length > 1) && <div className="entity-artist-preview__song-list">
            <p>Related music:</p>
            <ul>
              {filteredSongs.map(song => (
                <QueuePreview key={song._id} song={song} />
              ))}
            </ul>
          </div>}
        </div>
      </ScrollArea>
    </section >
  )
}