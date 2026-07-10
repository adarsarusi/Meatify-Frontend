import { useLocation, useNavigate } from 'react-router-dom'
import { IconComp } from './globalCmps/IconComp'

import { StationCover } from './globalCmps/StationCover'
import { setQueue, setCurrentSong, setPlayingStation, toggleIsPlaying } from "../store/actions/player.actions.js"
import { useSelector } from 'react-redux'

export function StationPreview({ station }) {

    const location = useLocation()
    const navigate = useNavigate()

    const selectedStation = useSelector((storeState) => storeState.stationModule.selectedStation)
    const currPlayingStation = useSelector((storeState) => storeState.playerModule.currPlayingStation)
    const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)

    const isCurrStationPlaying = currPlayingStation?._id === station?._id
    const isLikedStation = station.name !== 'Liked Songs'

    const isSelectedStation = location.pathname === `/station/${station._id}`


    return <article className={`station-preview ${isSelectedStation ? 'station-preview--active' : ''}`}>

        <div className='station-preview__cover-container'>
            <StationCover entity={station} />
            <button className="station-preview__btn"
                onClick={() => {
                    if (isCurrStationPlaying) {
                        toggleIsPlaying()
                    } else {
                        setQueue(station.songs)
                        setCurrentSong(station.songs[0])
                        setPlayingStation(station)
                    }
                }}>
                {isCurrStationPlaying && isPlaying ? (
                    <IconComp name="pause" className="icon--white icon-no-padding" />
                ) : (
                    <IconComp name="play" className="icon--white icon-no-padding" />
                )}
            </button>
        </div>


        <div className="station-preview__info" onClick={() => navigate(`/station/${station._id}`)}>
            <p className={`song-preview__title ${(isCurrStationPlaying && isPlaying) ? "playing-song" : ""} ellipsis-text  `}>{station.name}</p>
            {isLikedStation && <p className='station-preview__creator-name ellipsis-text'>{station.createdBy.fullname}</p>}
            {!isLikedStation && <p className='station-preview__song-length ellipsis-text'>{station.songs.length} songs</p>}
        </div>

        {(isCurrStationPlaying && isPlaying) && <div className="station-preview__station-playing-icon">
            <IconComp name='volume-playing' className='icon--sm icon--active' />
        </div>}
    </article >

}