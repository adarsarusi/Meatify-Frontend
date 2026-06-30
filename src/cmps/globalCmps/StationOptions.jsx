
import { useState, useEffect } from "react"
import { setQueue, setCurrentSong } from "../../store/actions/player.actions"

import { IconComp } from "./IconComp"
import { LikeBtn } from "../LikeBtn"

export function StationOptions({ likedStation, station, isOwner, onEditStation, onRemoveStation }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const isLikedStation = station._id === 'likedSongs'

    useEffect(() => {
        function closeMenu() {
            setIsMenuOpen(false)
        }

        window.addEventListener('click', closeMenu)

        return () => {
            window.removeEventListener('click', closeMenu)
        }
    }, [])

    return (
        <section className="station-options">
            {station?.songs?.length > 0 && <button
                className="btn play-btn big-play-btn"
                onClick={() => {
                    setQueue(station.songs)
                    setCurrentSong(station.songs[0])
                }}
            >
                <IconComp name="play" className="icon--md" />
            </button>}

            <button className="btn">
                <IconComp name="shuffle" className="icon--lg" />
            </button>

            <button className="btn">
                <IconComp name="download" className="icon--lg" />
            </button>

            {!isLikedStation && <div className="btn">
                <LikeBtn
                    itemId={station._id}
                    userField="likedStationIds"
                    iconSize="icon--lg"
                />
            </div>}

            {(isOwner) && (
                <div className="station-options-container">

                    <button className="btn"
                        onClick={(ev) => {
                            ev.stopPropagation()
                            setIsMenuOpen(prev => !prev)
                        }}>
                        <IconComp name="more" className="icon--muted icon--lg" />
                    </button>

                    {isMenuOpen && (
                        <div className="station-options__menu">

                            <button className="station-options__menu__item"
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    onEditStation()
                                }}
                            >
                                Edit details
                            </button>

                            {!likedStation && <button className="station-options__menu__item"
                                onClick={() => {
                                    setIsMenuOpen(false)
                                    onRemoveStation()
                                }}
                            >
                                Delete playlist
                            </button>}


                        </div>
                    )}
                </div>
            )}

        </section >
    )
}

