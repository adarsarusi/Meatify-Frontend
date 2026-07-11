import { useNavigate } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconComp } from './globalCmps/IconComp'

import { StationCover } from './globalCmps/StationCover'
import { setCurrentSong } from "../store/actions/player.actions.js"
import { useSelector } from 'react-redux'

export function QueuePreview({ song }) {

    const navigate = useNavigate()

    const { setNodeRef, transform, transition, attributes, listeners, } = useSortable({ id: song._id, })
    const currentSong = useSelector(
        (storeState) => storeState.playerModule.currentSong,
    )
    const isCurrentSong = currentSong?._id === song._id

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return <article
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="queue-preview">

        <div className='queue-preview__cover-container'>
            <StationCover entity={song} />
            <button className="queue-preview__btn queue-preview__btn--play"
                onClick={() => setCurrentSong(song)}>
                <IconComp name="play" className="icon--white" />
            </button>
        </div>

        <div className="queue-preview__info">
            <p className={`queue-preview__title ${(isCurrentSong) ? "playing-song" : ""} ellipsis-text`}>{song.title}</p>
            <p className='queue-preview__creator-name ellipsis-text '>{song?.artists[0].name}</p>
        </div>

        <button className="queue-preview__btn queue-preview__btn--more">
            <IconComp name="more" className="icon--white" />
        </button>
    </article>

}
