import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { addStation, loadStations } from '../store/actions/station.actions'
import { updateUser } from '../store/actions/user.actions.js'
import { loadSongs } from '../store/actions/song.actions.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'

import { stationService } from '../services/station/'
import { StationList } from './StationList'
import { StationFilter } from './StationFilter.jsx'
import { TOGGLE_EXPAND_LIBRARY } from '../store/reducers/system.reducer.js'
import { store } from '../store/store.js'
import { IconComp } from './globalCmps/IconComp.jsx'
import { ScrollArea } from './globalCmps/ScrollArea.jsx'

export function Library() {

    const navigate = useNavigate()
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
    const loggedinUser = useSelector(storeState => storeState.userModule.user  )
    const isExpanded = useSelector(
        storeState => storeState.systemModule.isExpanded
    )

    function onExpand() {
        store.dispatch({ type: TOGGLE_EXPAND_LIBRARY, isExpanded: !isExpanded })
    }

    useEffect(() => {
        loadSongs()
    }, [])

    useEffect(() => {
        loadStations(filterBy)
    }, [filterBy])

    async function onCreateStation() {
        const station = stationService.getEmptyStation()

        try {
            const savedStation = await addStation(station)

            await updateUser({
                ...loggedinUser,
                likedStationIds: [
                    ...(loggedinUser.likedStationIds || []),
                    savedStation._id
                ]
            })

            showSuccessMsg('Station added!')
            navigate(`/station/${savedStation._id}`)

        } catch (err) {
            console.log('Could not create station', err)
            showErrorMsg("Couldn't add station")
        }
    }

    return <section className="app-library">

        <div className="library-header">
            <h3>Your Library</h3>

            <section className="library-controls">
                <button onClick={onCreateStation} className="btn bg-button">
                    <IconComp name="create" className="icon--sm icon--muted" />
                    Create
                </button>
                <button onClick={onExpand} className="btn hover-bg">
                    <IconComp name="expend" className="icon--sm icon--muted" />
                </button>
            </section>
        </div >

        <div className="filter">
            <StationFilter />
        </div>

        <ScrollArea>
            <StationList stations={stations} />
        </ScrollArea>

    </section >

}