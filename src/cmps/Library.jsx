import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import { loadStations } from '../store/actions/station.actions'

import { stationService } from '../services/station/'
import { StationList } from './StationList'

export function Library() {

    const [ filterBy, setFilterBy ] = useState(stationService.getDefaultFilter())
    const stations = useSelector(storeState => storeState.stationModule.stations)

    useEffect(() => {
        loadStations(filterBy)
    }, [filterBy])


    return <section className="app-library">
        <div className="library-header">
            <h3>Your Library</h3>

            <section className="library-controls">
                <button>Create</button>
                <button>Expand</button>
            </section>
        </div>

        <div className="filter">

        </div>

        <StationList 
                stations={stations}/>
    </section>

}