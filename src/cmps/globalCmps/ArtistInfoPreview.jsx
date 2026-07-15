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
import { LikeBtn } from "../LikeBtn"


export function ArtistInfoPreview({ currentSong }) {
  const navigate = useNavigate()

  const [artistInfo, setArtistInfo] = useState(null)
  const [imageError, setImageError] = useState(false)

  const songs = useSelector(storeState => storeState.songModule.songs)
  const currPlayingStation = useSelector(storeState => storeState.playerModule.currPlayingStation)

  useEffect(() => {
    if (currentSong?.artists?.[0]?.name) {
      songService.getArtistInfo(currentSong._id, currentSong.artists[0].name).then(setArtistInfo)
    }
  }, [currentSong])

  if (!currentSong) return null
  if (!artistInfo) return null

  const { name, bio, monthlyListeners, imgUrl, fans } = artistInfo

  // const shortBio = `${bio.slice(0, 95)} ...`

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
            <div>
              <div className="entity-artist-preview__song-title ellipsis-text">
                {currentSong?.title}
              </div>
              <div className="entity-artist-preview__artists ellipsis-text">{name}</div>
            </div>
            <LikeBtn itemId={currentSong?._id} userField="likedSongIds" iconSize="icon--sm" />
          </div>
          <div className="entity-artist-preview__description">
            <div className="entity-artist-description__image-container">
              <p className="entity-artist-description__text">About the artist</p>
              {imgUrl && !imageError && (
                <img
                  className="entity-artist-description__pic"
                  src={imgUrl}
                  alt="Artist"
                  onError={() => setImageError(true)}
                />
              )}
            </div>
            <div className="entity-artist-preview__description-meta">
              <div className="entity-artist-description__name">
                <p className="ellipsis-text"> {name}</p>
                <IconComp name="verified" className="icon--lightgreen icon--sm" />
              </div>
              <div className="entity-artist-description__follow-contain">
                <p>{new Intl.NumberFormat('en-US').format(monthlyListeners)} Monthly Listeners </p>
                <button className="btn outline-button">Follow</button>
              </div>
              <p className="entity-artist-description__bio ellipsis-text--box">{bio}</p>
            </div>
          </div>
          {(filteredSongs.length > 1) && <div className="entity-artist-preview__song-list">
            <div className="entity-artist-song-list__header">
              <p>Related music:</p>
            </div>
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