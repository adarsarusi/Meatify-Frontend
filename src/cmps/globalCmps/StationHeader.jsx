import { StationCover } from "./StationCover"
import { useState, useEffect } from "react"
import { IconComp } from "./IconComp"

export function StationHeader({ station, isOwner, onRemoveStation, onEditStation }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        function closeMenu() {
            setIsMenuOpen(false)
        }

        window.addEventListener('click', closeMenu)

        return () => {
            window.removeEventListener('click', closeMenu)
        }
    }, [])

    if (!station) return null

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
        <section className="station-header">
            <div className="station-img-container">
                <StationCover entity={station} />
            </div>
            <div className="station-header__info ">

                {isOwner && (
                    <div className="station-menu-container">

                        <button className="icon-btn"
                            onClick={(ev) => {
                                ev.stopPropagation()
                                setIsMenuOpen(prev => !prev)
                            }}>
                            <IconComp name="more" className="icon--md icon--muted" />
                        </button>

                        {isMenuOpen && (
                            <div className="station-menu">

                                <button className="station-menu__item"
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        onEditStation()
                                    }}
                                >
                                    Edit details
                                </button>

                                <button className="station-menu__item"
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        onRemoveStation()
                                    }}
                                >
                                    Delete playlist
                                </button>

                            </div>
                        )}
                    </div>
                )}

                <p>{`${station?.isPrivate ? 'Private' : 'Public'} Playlist`}</p>
                <h1 className="station-name">{station?.name}</h1>
                <div className="station-meta">
                    <div className="participants">
                        <div className="creator-img-container">
                            <div className="avatar-wrapper" style={{ "--index": 1 }}>
                                <img src={station.createdBy?.imgUrl || ''} alt={station.createdBy?.fullname || ''} />
                            </div>
                            {station.participants?.map((participant, i) => (
                                <div className="avatar-wrapper" key={participant._id} style={{ "--index": i + 2 }}>
                                    <img src={participant.imgUrl} alt={participant.fullname} />
                                </div>
                            ))}
                        </div>
                        <p className="creator-name">{station.createdBy?.fullname || 'Unknown'}</p>
                        {station.participants?.length > 0 && (
                            <p>and {station.participants.length} others</p>
                        )}
                    </div>

                    <p> • {station.savedCount ?? 0} saves • </p>
                    <p>{station.songs?.length ?? 0} songs,</p>
                    <p>about {formatDuration(station.songs)}</p>
                </div>

            </div>

        </section >
    )
}

