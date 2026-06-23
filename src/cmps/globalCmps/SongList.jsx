import React from 'react'
import SongPreview from './SongPreview'

export function SongList({ songs = [], isOwner }) {
    if (!songs || songs.length === 0) return <div className="song-list song-list--empty">No songs</div>

    return (
        <section className="song-list">
            {songs.map((song, index = 0) => (
                <SongPreview
                    key={song._id || index}
                    song={song}
                    index={index + 1}
                />
            ))}
        </section>
    )
}

export default SongList