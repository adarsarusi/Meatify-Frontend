import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IconComp } from './IconComp'

import { LikeBtn } from '../LikeBtn'
import { StationCover } from './StationCover'
import { setCurrentSong } from '../../store/actions/player.actions'

export function PreviewSong({ song, index }) {
    const navigate = useNavigate()

    function formatTime(seconds = 0) {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    function navigateToSong(ev) {
        ev.preventDefault()
        navigate(`/song/${song._id}`)
    }

    return (
        <section aria-label={song.title} className="song-preview__item" >
            <div className='song-preview__play'>
            <p className="song-preview__index">{index}</p>
                <button className="song-preview__btn song-preview__btn--play" onClick={() => setCurrentSong(song)}>
                    <IconComp name="play" className="icon--white icon-no-padding" />
                </button>
            </div>

            <div className="song-preview__meta">
                <StationCover entity={song} />
                <div className='song-preview__meta-text'>
                    <div className="song-preview__title">{song.title}</div>
                    <div className="song-preview__artists">{(song.artists || []).join(', ')}</div>
                </div>
            </div>

            <div className="song-preview__album">{song.album}</div>

            <div className="song-preview__date">28/06/26</div>

            <div className="song-preview__actions">
                <div className="song-preview__btn song-preview__btn--like">
                    <LikeBtn
                        itemId={song._id}
                        userField="likedSongIds"
                    />
                </div>

                <div className="song-preview__duration">{formatTime(song.duration)}</div>

                <button className="song-preview__btn song-preview__btn--more">
                    <IconComp name="more" className="icon--white" />
                </button>
            </div>

        </section>
    )
}

export default PreviewSong