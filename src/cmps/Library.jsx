import { useState } from 'react'
import { stationService } from '../services/station/'

export function Library() {

    const [ filterBy, setFilterBy ] = useState(stationService.getDefaultFilter())

    return <section className="library">
        <div className="library-header">
            <h3>Your Library</h3>

            <section className="libarary-controls">
                <button>Create</button>
                <button>Expand</button>
            </section>
        </div>

        <div className="filter">

        </div>

        {/* <LibraryList /> */}
    </section>

}