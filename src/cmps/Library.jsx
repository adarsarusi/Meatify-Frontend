import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { addStation, loadStations } from '../store/actions/station.actions'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { stationService } from '../services/station/'
import { StationList } from './StationList'
import { StationFilter } from './StationFilter.jsx'
import { TOGGLE_EXPAND_LIBRARY } from '../store/reducers/system.reducer.js'
import { store } from '../store/store.js'
import { Icon } from './globalCmps/icon.jsx'

export function Library() {

    const stations = useSelector(storeState => storeState.stationModule.stations)
    const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
    const isExpanded = useSelector(
        storeState => storeState.systemModule.isExpanded
    )

    function onExpand() {
        store.dispatch({ type: TOGGLE_EXPAND_LIBRARY, isExpanded: !isExpanded })
    }

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
                <button onClick={onAddStation} className="icon-btn">
                    Create
                    <Icon name="create" className="icon--sm" />
                </button>
                <button onClick={onExpand} className="icon-btn">
                    <Icon name="expend" className="icon--sm" />
                </button>
            </section>
        </div >

        <div className="filter">
            <StationFilter />
        </div>

        <StationList
            stations={stations} />
    </section >

}