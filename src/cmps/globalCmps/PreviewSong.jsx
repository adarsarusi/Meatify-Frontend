import React from 'react'
import { Icon } from './icon'

import { LikeBtn } from '../LikeBtn'

export function PreviewSong({ song, index }) {

    function formatTime(seconds = 0) {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    return (
        <article className="song-preview__item">
            <p className="song-preview__index">{index}</p>

            <div className="song-preview__meta">
                <div className="song-preview__img">
                    {song.imgUrl ? <img src={song.imgUrl} alt={song.title} /> : <div className="song-preview__img-placeholder">♪</div>}
                </div>
                <div className='song-preview__meta-text'>
                    <div className="song-preview__title">{song.title}</div>
                    <div className="song-preview__artists">{(song.artists || []).join(', ')}</div>
                </div>
            </div>
            <div className="song-preview__controls">
                <button className="song-preview__btn song-preview__btn--play btn-reset">
                    <Icon name="play" className="icon--white" />
                </button>
                <div className="song-preview__btn song-preview__btn--like">
                    <LikeBtn
                        itemId={song._id}
                        userField="likedSongIds"
                    />
                </div>
                <button className="song-preview__btn song-preview__btn--more icon-btn btn-reset">
                    <Icon name="more" className="icon--white" />
                </button>
            </div>
            <div className="song-preview__duration">{formatTime(song.duration)}</div>
        </article>
    )
}

export default PreviewSong