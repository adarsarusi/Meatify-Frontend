import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SongList } from '../cmps/globalCmps/SongList'
import { SquarePreview } from '../cmps/globalCmps/SquarePreview'
import { TAGS_DATA } from '../services/station/station.service.local'
import { ScrollArea } from '../cmps/globalCmps/ScrollArea'


export function TagDetails() {
    const { tag } = useParams()

    const stations = useSelector(
        storeState => storeState.stationModule.stations
    )

    const filteredStations = stations.filter(station =>
        station.tags?.some(
            stationTag =>
                stationTag.toLowerCase() === tag.toLowerCase()
        )
    )

    const songs = useSelector(
        storeState => storeState.songModule.songs
    )

    const filteredSongs = songs.filter(song =>
        song.tags?.some(
            songTag =>
                songTag.toLowerCase() === tag.toLowerCase()
        )
    )

    const tagData = TAGS_DATA.find(
        currTag => currTag.title === tag
    )

    return (
        <section
            className="tag-details dynamic-area"
            style={{
                '--tag-color': tagData?.color || '#509BF5',
            }}>
            <ScrollArea>

                <header className="tag-details__header">
                    <div>
                        <h1>{tag}</h1>
                    </div>
                </header>

                <div className="tag-details__lists">
                    {filteredStations.length > 0 && (
                        <div className="tag-details__station-list">
                            <h2>Stations</h2>
                            <ul className='square-list'>
                                {filteredStations.map(station =>

                                    <li key={station._id}>
                                        <SquarePreview entity={station} />
                                    </li>)}
                            </ul>
                        </div>
                    )}
                    <div className="tag-details__song-list">
                        <h2>Songs</h2>
                        <SongList songs={filteredSongs} />
                    </div>
                </div>
            </ScrollArea>
        </section>
    )
}