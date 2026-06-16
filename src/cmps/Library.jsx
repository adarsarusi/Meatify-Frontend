import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { addStation, loadStations } from '../store/actions/station.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { stationService } from '../services/station/'
import { StationList } from './StationList'
import { StationFilter } from './StationFilter.jsx'

export function Library() {

    const stations = useSelector(storeState => storeState.stationModule.stations)
    const filterBy = useSelector(state => state.stationModule.filterBy)

    useEffect(() => {
        loadStations(filterBy)
    }, [filterBy])

    async function onAddStation() {
        const station = stationService.getEmptyStation()
        station.name = prompt('Enter station name:')

        try {
            const savedStation = await addStation(station)
            showSuccessMsg(`Station added!`)
        } catch (err) {
            showErrorMsg(`Couldn't add Station`)
        }
    }


    return <section className="app-library">
        <div className="library-header">
            <h3>Your Library</h3>

            <section className="library-controls">
                <button onClick={onAddStation}>Create</button>
                <button>Expand</button>
            </section>
        </div>

        <div className="filter">
            <StationFilter />
        </div>

        <StationList
            stations={stations} />
    </section>

}