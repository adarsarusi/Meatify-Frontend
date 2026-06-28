import { useNavigate } from 'react-router-dom'
import { IconComp } from './globalCmps/IconComp'
import { StationCover } from './globalCmps/StationCover'
import { setCurrentSong } from '../store/actions/player.actions'

export function QueuePreview({ song }) {

    const navigate = useNavigate()

    return <article className="queue-preview">

        <StationCover entity={song} />

        <div className="queue-preview__info">
            <p className='queue-preview__title'>{song.name}</p>
            <p className='queue-preview__creator-name'>{song.artists[0]}</p>
        </div>
        <div className="queue-preview__controls">
            <button className="queue-preview__btn queue-preview__btn--play" onClick={() => setCurrentSong(song)}>
                <IconComp name="play" className="icon--white" />
            </button>
            <button className="queue-preview__btn queue-preview__btn--more  btn-reset">
                <IconComp name="more" className="icon--white" />
            </button>
        </div>
    </article>

}