import { useNavigate } from 'react-router-dom'
import { IconComp } from './globalCmps/IconComp'
import { StationCover } from './globalCmps/StationCover'
import { setQueue, setCurrentSong } from "../store/actions/player.actions.js"

export function StationPreview({ station }) {

    const navigate = useNavigate()

    return <article className="station-preview">

        <StationCover entity={station} />

        <div className="station-preview__info" onClick={() => navigate(`/station/${station._id}`)}>
            <p className='station-preview__title'>{station.name}</p>
            {station._id !== 'likedSongs' && <p className='station-preview__creator-name'>{station.createdBy.fullname}</p>}
            {station._id === 'likedSongs' && <p className='station-preview__song-length'>{station.songs.length} songs</p>}
        </div>
        <div className="station-preview__controls">
            <button className="station-preview__btn station-preview__btn--play"
                onClick={() => {
                    setQueue(station.songs)
                    setCurrentSong(station.songs[0])
                }}>
                <IconComp name="play" className="icon--white" />
            </button>
            <button className="station-preview__btn station-preview__btn--more  btn-reset">
                <IconComp name="more" className="icon--white" />
            </button>
        </div>
    </article>

}