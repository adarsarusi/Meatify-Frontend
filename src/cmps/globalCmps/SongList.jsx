import React from 'react'
import PreviewSong from './PreviewSong'

export function SongList({ songs = [] }) {
    if (!songs || songs.length === 0) return <div className="song-list song-list--empty">No songs</div>

    return (
        <section className="song-list">
            {songs.map((song, idx) => (
                <PreviewSong key={song._id || idx} song={song} index={idx} />
            ))}
        </section>
    )
}

export default SongList
