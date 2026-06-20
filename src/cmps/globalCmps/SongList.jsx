import React from 'react'
import PreviewSong from './PreviewSong'

export function SongList({ songs = [] }) {
    if (!songs || songs.length === 0) return <div className="song-list song-list--empty">No songs</div>

    return (
        <section className="song-list">
            {songs.map((song, index = 0) => (
                <PreviewSong
                    key={song._id || index}
                    song={song}
                    index={index + 1}
                />
            ))}
        </section>
    )
}

export default SongList