import { useNavigate } from 'react-router-dom'
import { IconComp } from './globalCmps/IconComp'

import { StationCover } from './globalCmps/StationCover'
import { setQueue, setCurrentSong, setPlayingStation,toggleIsPlaying} from "../store/actions/player.actions.js"
import { useSelector } from 'react-redux'

export function StationPreview({ station }) {

    const currStation = useSelector((storeState) => storeState.playerModule.currPlayingStation)
    const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)

    const isCurrStationPlaying = currStation?._id === station?._id


    const navigate = useNavigate()

    return <article className="station-preview">

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
            <p className={`song-preview__title ${(isCurrStationPlaying && isPlaying) ? "playing-song" : ""} ellipsis-text `}>{station.name}</p>
            {station._id !== 'likedSongs' && <p className='station-preview__creator-name ellipsis-text'>{station.createdBy.fullname}</p>}
            {station._id === 'likedSongs' && <p className='station-preview__song-length ellipsis-text'>{station.songs.length} songs</p>}
        </div>
    </article >

}