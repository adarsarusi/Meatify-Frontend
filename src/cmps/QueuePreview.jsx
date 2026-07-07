import { useNavigate } from 'react-router-dom'
import { IconComp } from './globalCmps/IconComp'

import { StationCover } from './globalCmps/StationCover'
import { setCurrentSong } from "../store/actions/player.actions.js"

export function QueuePreview({ song }) {

    const navigate = useNavigate()

    return <article className="queue-preview">

        <div className='queue-preview__cover-container'>
            <StationCover entity={song} />
            <button className="queue-preview__btn queue-preview__btn--play"
                onClick={() => setCurrentSong(song)}>
                <IconComp name="play" className="icon--white" />
            </button>
        </div>

        <div className="queue-preview__info" onClick={() => navigate(`/song/${song._id}`)}>
            <p className='queue-preview__title ellipsis-text '>{song.title}</p>
            <p className='queue-preview__creator-name ellipsis-text '>{song.artists[0].name}</p>
        </div>

        <button className="queue-preview__btn queue-preview__btn--more">
            <IconComp name="more" className="icon--white" />
        </button>
    </article>

}
