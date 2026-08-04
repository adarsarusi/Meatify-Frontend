
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { setQueue, setCurrentSong, setPlayingStation, toggleIsPlaying, toggleShuffleQueue } from "../../store/actions/player.actions"
import { TOGGLE_IS_SHUFFLE } from "../../store/reducers/player.reducer"

import { IconComp } from "./IconComp"
import { LikeBtn } from "../LikeBtn"
import { store } from "../../store/store.js"

export function StationOptions({ station, stationSongs, isOwner, onEditStation, onRemoveStation }) {


    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isShuffle = useSelector((storeState) => storeState.playerModule.isShuffle)

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

    

    const onPlayStation = (ev) => {
        ev.stopPropagation()
        if (isCurrStationPlaying) {
            toggleIsPlaying()
        } else {
            setQueue(stationSongs)
store.dispatch({type:'TOGGLE_IS_SHUFFLE', isShuffle: false})
            setPlayingStation(station)
            if (stationSongs.length > 0) {
                setCurrentSong(stationSongs[0])
            }
        }
    }


    return (
        <section className="station-options">
            <div className="station-options__btn-container">
                {station?.songs?.length > 0 && <button
                    className="station-options__play-btn btn play-btn green-btn "
                    onClick={onPlayStation}
                >   {(isPlaying && isCurrStationPlaying) ?
                    <IconComp name="pause" className="icon--md" />
                    : <IconComp name="play" className="icon--md" />
                    }
                </button>}

                <button
                    className={`btn ${isShuffle ? 'no-hover' : ''} `}
                    onClick={toggleShuffleQueue}
                    title={isShuffle ? "Disable shuffle" : "Enable shuffle"}
                >
                    <IconComp
                        name="shuffle"
                        className={(isShuffle && isCurrStationPlaying) ? "icon--active icon--lg " : "icon--muted icon--lg"}
                    />
                </button>

                {!isLikedStation &&
                    <LikeBtn
                        itemId={station._id}
                        userField="likedStationIds"
                        iconSize="icon--lg"
                    />
                }

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

