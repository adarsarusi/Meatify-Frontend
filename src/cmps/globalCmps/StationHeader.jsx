import { StationCover } from "./StationCover"
import { IconComp } from "./IconComp"


export function StationHeader({
    station,
    isOwner,
    user, }) {

    const isLikedStation = station.tags?.includes("Liked")

    function formatDuration(songs) {
        if (!songs || songs.length === 0) return '0 min'
        const totalSeconds = songs.reduce((total, song) => total + song.duration, 0)

        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)

        const parts = []
        if (hours > 0) parts.push(`${hours} hr`)
        if (minutes > 0) parts.push(`${minutes} min`)

        return parts.join(' ')
    }

    return (
        <section className="station-header dynamic-max-width">
            <div className="station-img-container">
                <StationCover entity={station} />
            </div>
            <div className="station-header__info ">

                <p className="station-header__private-txt">{!isLikedStation ? (station?.isPrivate ? 'Private Playlist' : 'Public Playlist') : 'Playlist'}</p>
                <h1 className="station-name">{station?.name}</h1>
                <div className="station-meta">
                    <div className="participants">
                        <div className="creator-img-container">
                            <div className="avatar-wrapper" style={{ "--index": 1 }}>
                                <img
                                    src={station.createdBy?.imgUrl || ''}
                                    alt={station.createdBy?.fullname || ''}
                                />
                            </div>

                            {!isLikedStation && station.participants?.map((participant, i) => (
                                <div
                                    className="avatar-wrapper"
                                    key={i}
                                    style={{ "--index": i + 2 }}
                                >
                                    <img
                                        src={participant.imgUrl}
                                        alt={participant.fullname}
                                    />
                                </div>
                            ))}
                        </div>

                        <p className="creator-name">{station.createdBy?.fullname || 'Unknown'}</p>

                        {station.participants?.length > 0 && (
                            <p>and {station.participants.length} others</p>
                        )}
                    </div>

                    {!isLikedStation && <p> • {station.savedCount ?? 0} saves • </p>}
                    <p> {station.songs?.length ?? 0} songs,</p>
                    <p>about {formatDuration(station.songs)}</p>
                </div>

            </div>

        </section >
    )
}

