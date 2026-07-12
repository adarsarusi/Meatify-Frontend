import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IconComp } from './globalCmps/IconComp'
import { LikeBtn } from './LikeBtn'
import { StationCover } from './globalCmps/StationCover'
import { setQueue, setCurrentSong, setPlayingStation, toggleIsPlaying } from "../store/actions/player.actions.js"

export function StationPreview({ station, isSearch }) {
    const location = useLocation()
    const navigate = useNavigate()

    const isLoading = useSelector((storeState) => storeState.systemModule.isLoading)
    const currPlayingStation = useSelector((storeState) => storeState.playerModule.currPlayingStation)
    const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)
    const songs = useSelector((storeState) => storeState.songModule.songs) || []
    const loggedinUser = useSelector(storeState => storeState.userModule.user)

    const isLikedSongsStation = station?.tags?.includes("Liked")
    const isCurrStationPlaying = currPlayingStation?._id === station?._id
    const isSelectedStation = location.pathname === `/station/${station?._id}`

    const stationSongs = songs.filter(song =>
        station?.songs?.includes(song._id.toString())
    )

    const songCount = loggedinUser?.likedSongIds?.length || 0

    if (isLoading || !station) return null

    const onPlayStation = (ev) => {
        ev.stopPropagation()
        if (isCurrStationPlaying) {
            toggleIsPlaying()
        } else {
            setQueue(stationSongs)
            setPlayingStation(station)
            if (stationSongs.length > 0) {
                setCurrentSong(stationSongs[0])
            }
        }
    }

    return (
        <article className={`station-preview ${isSelectedStation ? 'station-preview--active' : ''}`}>

            <div className='station-preview__cover-container'>
                <StationCover entity={station} />
                <button 
                    className="station-preview__btn"
                    onPointerDown={(ev) => ev.stopPropagation()}
                    onClick={onPlayStation}
                >
                    {isCurrStationPlaying && isPlaying ? (
                        <IconComp name="pause" className="icon--white icon-no-padding" />
                    ) : (
                        <IconComp name="play" className="icon--white icon-no-padding" />
                    )}
                </button>
            </div>

            <div className="station-preview__info" onClick={() => navigate(`/station/${station._id}`)}>
                <p className={`song-preview__title ${isCurrStationPlaying && isPlaying ? "playing-song" : ""} ellipsis-text`}>
                    {station.name}
                </p>

                {isLikedSongsStation ? (
                    <p className='station-preview__song-length ellipsis-text'>{songCount} songs</p>
                ) : (
                    <p className='station-preview__creator-name ellipsis-text'>{station?.createdBy?.fullname}</p>
                )}
            </div>

            {isSearch ? (
                <div className="btn station-preview__station-icon">
                    <LikeBtn
                        itemId={station._id}
                        userField="likedStationIds"
                        iconSize="icon--sm"
                    />
                </div>
            ) : (isCurrStationPlaying && isPlaying) && (
                <div className="station-preview__station-icon">
                    <IconComp name='volume-playing' className='icon--sm icon--active' />
                </div>
            )}
            
        </article>
    )
}