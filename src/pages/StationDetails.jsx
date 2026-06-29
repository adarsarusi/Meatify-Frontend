import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loadStation, updateStation, removeStation } from '../store/actions/station.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { EditModal } from '../cmps/globalCmps/EditModal'
import { StationHeader } from '../cmps/globalCmps/StationHeader'
import SongList from '../cmps/globalCmps/SongList'
import { SquarePreview } from '../cmps/globalCmps/SquarePreview'
import { IconComp } from '../cmps/globalCmps/IconComp'

export function StationDetails() {
    const navigate = useNavigate()
    const { id } = useParams()
    const user = useSelector(storeState => storeState.userModule.user)
    const station = useSelector(storeState => storeState.stationModule.selectedStation)
    const isLoading = useSelector(storeState => storeState.stationModule.isLoading)
    const songs = useSelector(storeState => storeState.songModule.songs)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [isSearchVisible,setIsSearchVisible] = useState(false)

    const likedStation = id === 'likedSongs'
    const likedSongs = songs.filter(song =>
        user?.likedSongIds?.includes(song._id)
    )
console.log('user: ', user)
    useEffect(() => {
        if (!id) return
        loadStation(id)
    }, [id])

    async function onSaveStation(updatedStation) {
        try {
            await updateStation(updatedStation)

            showSuccessMsg('Playlist updated')
        } catch (err) {
            console.log(err)
            showErrorMsg("Couldn't update playlist")
        }
    }

    async function onRemoveStation() {
        const isConfirmed = confirm(
            `Delete "${station.name}"?`
        )

        if (!isConfirmed) return

        try {
            await removeStation(station._id)

            showSuccessMsg('Station removed')
            navigate('/')

        } catch (err) {
            console.log('Cannot remove station', err)
            showErrorMsg("Couldn't remove station")
        }
    }

    if (isLoading && !station) return (
        <section className="station-details">
            <div className="station-container">
                <div className="station-header">
                    <p>Loading station...</p>
                </div>
            </div>
        </section>
    )

    if (!station) {
        return (
            <section className="station-details">
                <div className="station-container">
                    <div className="station-header">
                        <p>Station not found</p>
                    </div>
                </div>
            </section>
        )
    }

    const isOwner = loggedInUser?._id === station.createdBy?._id

    return (
        <section className="station-details dynamic-area">
            <section className="station-details__header">
                <StationHeader
                    likedStation={likedStation}
                    user={user}
                    station={station}
                    isOwner={isOwner}
                    onRemoveStation={onRemoveStation}
                    onEditStation={() => setIsEditOpen(true)}
                />
            </section>

            {isEditOpen && (
                <EditModal
                    title="Edit playlist"
                    entity={station}
                    onClose={() => setIsEditOpen(false)}
                    onSave={onSaveStation}
                />
            )}

            <section className='station-details__song-list'>
                {console.log('likedSongs: ', likedSongs)}
                {!likedStation ? <SongList songs={station?.songs || []} /> :

                    <SongList songs={likedSongs} />
                }
                <button className='station-details__find-more-btn' onClick={() => setIsSearchVisible(true)}>
                    <span>Find more</span>
                    </button>
                {(station.length === 0 || isSearchVisible) && (
                    <div className="station-details__search-container">
                        
                        <div>
                        <h2>Let's find something for your playlist</h2>
                        <div className='station-details__search-bar'>
                            <span><IconComp name="search" /></span>
                            <input type="text" placeholder="Search for songs..." />
                        </div>
                        </div>
                        <button onClick={() => setIsSearchVisible(false)}><span><IconComp name="close"/></span></button>
                        </div>
                )}
            </section>
        </section>)
}

