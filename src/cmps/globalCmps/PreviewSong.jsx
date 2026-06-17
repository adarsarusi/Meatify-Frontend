import React from 'react'

export function PreviewSong({ song, index }) {
    function formatTime(seconds = 0) {
        const m = Math.floor(seconds / 60)
        const s = seconds % 60
        return `${m}:${s.toString().padStart(2, '0')}`
    }

    return (
        <article className="song-list__item">
            <div className="song-list__img">
                {song.imgUrl ? <img src={song.imgUrl} alt={song.title} /> : <div className="song-list__thumb-placeholder">♪</div>}
            </div>
            <div className="song-list__meta">
                <div className="song-list__title">{song.title}</div>
                <div className="song-list__artists">{(song.artists || []).join(', ')}</div>
            </div>
            <div className="song-list__controls">
                <button className="song-list__btn song-list__btn--play">Play</button>
                <button className="song-list__btn song-list__btn--add">Add</button>
                <div className="song-list__duration">{formatTime(song.duration)}</div>
            </div>
        </article>
    )
}

export default PreviewSong
