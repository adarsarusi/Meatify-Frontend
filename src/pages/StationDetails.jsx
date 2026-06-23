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

export function StationDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const station = useSelector(storeState => storeState.stationModule.selectedStation)
    const isLoading = useSelector(storeState => storeState.stationModule.isLoading)
    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    const [isEditOpen, setIsEditOpen] = useState(false)

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

            <section className="station-details__song-list">
                <SongList
                    songs={station.songs || []}
                    isOwner={isOwner}
                />
            </section>
        </section>
    )
}

