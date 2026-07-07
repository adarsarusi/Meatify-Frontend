import { useNavigate } from 'react-router-dom'
import { IconComp } from './globalCmps/IconComp'

import { StationCover } from './globalCmps/StationCover'
import { setQueue, setCurrentSong } from "../store/actions/player.actions.js"

export function StationPreview({ station }) {

    const navigate = useNavigate()

    return <article className="station-preview">

        <div className='station-preview__cover-container'>
            <StationCover entity={station} />
            <button className="station-preview__btn "
                onClick={() => {
                    setQueue(station.songs)
                    setCurrentSong(station.songs[0])
                }}>
                <IconComp name="play" className="icon--white" />
            </button>
        </div>


        <div className="station-preview__info" onClick={() => navigate(`/station/${station._id}`)}>
            <p className='station-preview__title ellipsis-text'>{station.name}</p>
            {station._id !== 'likedSongs' && <p className='station-preview__creator-name ellipsis-text'>{station.createdBy.fullname}</p>}
            {station._id === 'likedSongs' && <p className='station-preview__song-length ellipsis-text'>{station.songs.length} songs</p>}
        </div>
    </article>

}