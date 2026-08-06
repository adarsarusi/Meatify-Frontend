import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { IconComp } from './globalCmps/IconComp'
import { LikeBtn } from './LikeBtn'
import { StationCover } from './globalCmps/StationCover'

import { setQueue, setCurrentSong, setPlayingStation, toggleIsPlaying } from "../store/actions/player.actions.js"
import { TOGGLE_IS_SHUFFLE } from "../store/reducers/player.reducer.js"
import { store } from '../store/store.js'



export function StationPreview({ station, isSearch }) {
    const location = useLocation()
    const navigate = useNavigate()

    const isMinimizedLibrary = useSelector((storeState) => storeState.systemModule.isMinimizedLibrary)

    const currPlayingStation = useSelector((storeState) => storeState.playerModule.currPlayingStation)
    const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)
    const songs = useSelector((storeState) => storeState.songModule.songs) || []
    const loggedinUser = useSelector(storeState => storeState.userModule.user)
    const isShuffle = useSelector((storeState) => storeState.playerModule.isShuffle)


    const isLikedSongsStation = station?.tags?.includes("Liked")
    const isCurrStationPlaying = currPlayingStation?._id === station?._id
    const isSelectedStation = location.pathname === `/station/${station?._id}`
    const likedSongsCount = loggedinUser?.likedSongIds?.length || 0

    const likedSongIds = loggedinUser?.likedSongIds || []
    const stationSongsIds = station?.songs || []

    const isPinnedStation = station?.likedBy?.some(user => user.userId === loggedinUser?._id && user.isPinned)

    const stationSongs = useMemo(() => {
        const songIds = isLikedSongsStation ? likedSongIds : stationSongsIds
        if (!songIds.length) return []
        return songIds
            .map(songId => songs.find(song => song._id.toString() === songId))
            .filter(Boolean)
    }, [songs, station?.songs, likedSongIds, isLikedSongsStation])


    if (!station) return null

    const onPlayStation = (ev) => {
        ev.stopPropagation()
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

    return (
        <article className={`station-preview 
            ${isSelectedStation ? 'station-preview--active' : ''} 
        ${isMinimizedLibrary ? 'station-preview--minimized' : ''} `}
            onClick={() => { isMinimizedLibrary && navigate(`/station/${station._id}`) }}>

            <div className='station-preview__cover-container'>
                <StationCover entity={station} />
                {!isMinimizedLibrary && <button
                    className="station-preview__btn"
                    onPointerDown={(ev) => ev.stopPropagation()}
                    onClick={onPlayStation}
                >
                    <IconComp name={isPlaying && isCurrStationPlaying ? 'pause' : 'play'} className="icon--white icon-no-padding" />
                </button>}
            </div>

            {!isMinimizedLibrary && <div className="station-preview__info" onClick={() => navigate(`/station/${station._id}`)}>
                <p className={`song-preview__title ${isCurrStationPlaying && isPlaying ? "playing-song" : ""} ellipsis-text`}>
                    {station.name}
                </p>

                {isLikedSongsStation ? (
                    <p className='station-preview__song-length ellipsis-text'>{likedSongsCount} songs</p>
                ) : (
                    <div className='station-preview__creator-container'>
                        {isPinnedStation && (
                            <IconComp name='pin' className='icon--xxs icon--active icon-no-padding' />
                        )}
                        <p className={`station-preview__creator-name ellipsis-text }`}>
                            {station?.createdBy?.fullname}
                        </p>
                    </div>
                )}
            </div>}

            {isSearch ? (
                <div className="btn station-preview__station-icon">
                    <LikeBtn
                        itemId={station._id}
                        userField="likedStationIds"
                        iconSize="icon--sm"
                    />
                </div>
            ) : (isCurrStationPlaying && isPlaying && !isMinimizedLibrary) && (
                <div className="station-preview__station-icon">
                    <IconComp name='volume-playing' className='icon--sm icon--active' />
                </div>
            )}

        </article>
    )
}