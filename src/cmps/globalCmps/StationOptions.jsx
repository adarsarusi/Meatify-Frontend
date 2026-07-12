
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { setQueue, setCurrentSong, setPlayingStation, toggleIsPlaying } from "../../store/actions/player.actions"
import { shuffle } from "../../services/util.service.js"

import { IconComp } from "./IconComp"
import { LikeBtn } from "../LikeBtn"

export function StationOptions({ station, stationSongs, isOwner, onEditStation, onRemoveStation }) {

    const isLoading = useSelector(
        (storeState) => storeState.systemModule.isLoading,
    )

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isShuffle, setIsShuffle] = useState(false)
    const [originalQueue, setOriginalQueue] = useState([])
    const isPlaying = useSelector((storeState) => storeState.playerModule.isPlaying)
    const currPlayingStation = useSelector((storeState) => storeState.playerModule.currPlayingStation)
    const queue = useSelector((storeState) => storeState.playerModule.queue)


    const isCurrStationPlaying = currPlayingStation?._id === station?._id

    const isLikedStation = station?.tags?.includes("Liked")

    useEffect(() => {
        function closeMenu() {
            setIsMenuOpen(false)
        }

        window.addEventListener('click', closeMenu)

        return () => {
            window.removeEventListener('click', closeMenu)
        }
    }, [])

    function handleShuffle(queue) {
        if (!isShuffle) {
            setOriginalQueue(queue)
            const shuffledQueue = shuffle(queue)
            setQueue(shuffledQueue)
            setIsShuffle(true)
        } else {
            setQueue(originalQueue)
            setIsShuffle(false)
        }
    }

    if (isLoading) return

    return (
        <section className="station-options">
            <div className="station-options__btn-container">
                {station?.songs?.length > 0 && <button
                    className="station-options__play-btn btn play-btn green-btn "
                    onClick={() => {
                        if (isCurrStationPlaying) {
                            toggleIsPlaying()
                        } else {
                            setQueue(stationSongs)
                            setCurrentSong(stationSongs[0])
                            setPlayingStation(station)
                        }
                    }}
                >   {(isPlaying && isCurrStationPlaying) ?
                    <IconComp name="pause" className="icon--md" />
                    : <IconComp name="play" className="icon--md" />
                    }
                </button>}

                <button
                    className={`btn ${isShuffle ? 'no-hover' : ''} `}
                    onClick={() => handleShuffle(queue)}
                    title={isShuffle ? "Disable shuffle" : "Enable shuffle"}
                >
                    <IconComp
                        name="shuffle"
                        className={isShuffle ? "icon--active icon--lg" : "icon--muted icon--lg"}
                    />
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

                                {!isLikedStation && <button className="station-options__menu__item"
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        onRemoveStation()
                                    }}
                                >
                                    Delete station
                                </button>}


                            </div>
                        )}
                    </div>
                )}
            </div>
        </section >
    )
}

