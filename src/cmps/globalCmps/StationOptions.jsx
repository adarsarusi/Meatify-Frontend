
import { useState, useEffect } from "react"
import { setQueue, setCurrentSong } from "../../store/actions/player.actions"

import { IconComp } from "./IconComp"
import { LikeBtn } from "../LikeBtn"

export function StationOptions({ likedStation, station, isOwner, onEditStation, onRemoveStation }) {
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

    return (
        <section className="station-options">
            <button
                className="station-options__play-btn"
                onClick={() => {
                    setQueue(station.songs)
                    setCurrentSong(station.songs[0])
                }}
            >
                <IconComp name="play" />
            </button>

            <div className="station-options__like-btn">
                <LikeBtn
                    itemId={station._id}
                    userField="likedStationIds"
                />
            </div>

            {isOwner && (
                <div className="station-options-container">

                    <button className="station-options__more-btn"
                        onClick={(ev) => {
                            ev.stopPropagation()
                            setIsMenuOpen(prev => !prev)
                        }}>
                        <IconComp name="more" className="icon--muted" />
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

