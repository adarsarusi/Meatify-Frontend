
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { setQueue, setCurrentSong, setPlayingStation, toggleIsPlaying } from "../../store/actions/player.actions"

import { IconComp } from "./IconComp"
import { LikeBtn } from "../LikeBtn"

export function StationOptions({ likedStation, station, isOwner, onEditStation, onRemoveStation }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)
    const currPlayingStation = useSelector((storeState) => storeState.playerModule.currPlayingStation)

    const isCurrStationPlaying = currPlayingStation?._id === station?._id

    const isLikedStation = station?._id === 'likedSongs'

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
            <div className="station-options__btn-container">
                {station?.songs?.length > 0 && <button
                    className="station-options__play-btn btn play-btn green-btn "
                    onClick={() => {
                        if (isCurrStationPlaying) {
                            toggleIsPlaying()
                        } else {
                            setQueue(station.songs)
                            setCurrentSong(station.songs[0])
                            setPlayingStation(station)
                        }
                    }}
                >   {(isPlaying && isCurrStationPlaying) ?
                    <IconComp name="pause" className="icon--md" />
                    : <IconComp name="play" className="icon--md" />
                    }
                </button>}

                <button className="btn">
                    <IconComp name="shuffle" className="icon--muted  icon--lg" />
                </button>

                {!isLikedStation && <div className="btn">
                    <LikeBtn
                        itemId={station._id}
                        userField="likedStationIds"
                        iconSize="icon--lg"
                    />
                </div>}

                {(isOwner) && (
                    <div className="station-options__user-btns">

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
            </div>
        </section >
    )
}

