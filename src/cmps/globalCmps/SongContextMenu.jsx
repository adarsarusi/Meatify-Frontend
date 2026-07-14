import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { IconComp } from './IconComp'
import {
    addSongToStation,
    removeSongFromStation,
} from '../../store/actions/station.actions'

export function SongContextMenu({ song }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const btnRef = useRef(null)

    const station = useSelector(
        (storeState) => storeState.stationModule.selectedStation
    )
    const loggedinUser = useSelector(
        (storeState) => storeState.userModule.user
    )
    const stations = useSelector(
        (storeState) => storeState.stationModule.stations
    )

    const userStations = stations.filter(
        (station) =>
            station.createdBy?._id === loggedinUser?._id &&
            !station.tags?.includes('Liked')
    )

   const isSongInStation = station?.songs?.includes(song._id)
    

    function handleBlur(ev) {
        const currentTarget = ev.currentTarget
        setTimeout(() => {
            if (!currentTarget.contains(document.activeElement)) {
                setIsMenuOpen(false)
            }
        }, 0)
    }

    return (
        <button
            ref={btnRef}
            className="btn song-preview__btn song-preview__btn--more"
            onPointerDown={(ev) => ev.stopPropagation()}
            onClick={(ev) => {
                ev.stopPropagation()
                setIsMenuOpen(true)
            }}
            onBlur={handleBlur}
        >
            <IconComp name="more" className="icon--white" />
            {isMenuOpen && (
                <div
                    className="song-preview__context-menu"
                    onPointerDown={(ev) => ev.stopPropagation()}
                >
                    <div className="song-context-menu__button--add-wrapper">
                        <span className="song-context-menu__button song-context-menu__button--add">
                            <div>
                                <IconComp name="plus" className="icon--muted" />
                                Add to playlist
                            </div>
                            <IconComp name="triangle-arrow" className="icon--white icon--xs" />
                        </span>

                        <div className="song-context-menu__station-list">
                            {userStations.map((userStation) => {
                                const alreadyExists = userStation.songs?.includes(song._id)

                                return (
                                    <span
                                        key={userStation._id}
                                        className={
                                            alreadyExists
                                                ? 'song-context-menu__button disabled'
                                                : 'song-context-menu__button'
                                        }
                                        onClick={() => {
                                            if (alreadyExists) return
                                            addSongToStation(userStation._id, song._id)
                                            setIsMenuOpen(false)
                                        }}
                                    >
                                        {userStation.name}
                                        {alreadyExists && (
                                            <IconComp name="added" className="icon--active" />
                                        )}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    {isSongInStation && (
                        <span
                            className="song-context-menu__button"
                            onClick={(ev) => {
                                removeSongFromStation(station._id, song._id)
                            }}
                        >
                            <div>
                                <IconComp name="remove" className="icon--muted" />
                                Remove from this playlist
                            </div>
                        </span>
                    )}
                </div>
            )}
        </button>
    )
}