import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import SongList from '../cmps/globalCmps/SongList'

export function TagDetails() {
    const { tag } = useParams()

    const songs = useSelector(
        storeState => storeState.songModule.songs
    )

    const filteredSongs = songs.filter(song =>
        song.tags?.includes(tag)
    )

    return (
        <section className="tag-details dynamic-area">
            <header className="tag-details__header">
                <img
                    src={`/tags/${tag
                        .toLowerCase()
                        .replace(/\s+/g, '-')}.webp`}
                    alt={tag}
                />

                <div>
                    <p>Genre</p>
                    <h1>{tag}</h1>
                    <p>{filteredSongs.length} songs</p>
                </div>
            </header>

            <SongList songs={filteredSongs} />
        </section>
    )
}