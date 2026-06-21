import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { loadStation } from '../store/actions/station.actions'

import { StationHeader } from '../cmps/globalCmps/StationHeader'
import SongList from '../cmps/globalCmps/SongList'
import { SquarePreview } from '../cmps/globalCmps/SquarePreview'

export function StationDetails() {
    const { id } = useParams()
    const station = useSelector(storeState => storeState.stationModule.selectedStation)
    const isLoading = useSelector(storeState => storeState.stationModule.isLoading)

    useEffect(() => {
        if (!id) return
        loadStation(id)
    }, [id])

    if (isLoading && !station) return (
        <section className="station-details">
            <div className="station-container">
                <div className="station-header">
                    <p>Loading station...</p>
                </div>
            </div>
        </section>
    )

    return (
        <section className='station-details dynamic-area'>
            <section className='station-details__header'>
                <StationHeader station={station} />
            </section>
            <section className='station-details__song-list'>
                <SongList songs={station?.songs || []} />
            </section>
        </section>
    )
}

