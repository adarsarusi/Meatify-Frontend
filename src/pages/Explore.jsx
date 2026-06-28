import { useSelector } from "react-redux"
import { SquarePreview } from "../cmps/globalCmps/SquarePreview"

export function Explore() {

    const stations = useSelector(storeState => storeState.stationModule.stations)
    const isLoading = useSelector(storeState => storeState.stationModule.isLoading)
    const user = useSelector(storeState => storeState.userModule.user)

    if (isLoading && !stations) return (
        <section className="station-details">
            <div className="station-container">
                <div className="station-header">
                    <p>Loading stations...</p>
                </div>
            </div>
        </section>
    )

    return (
        <section className="explore dynamic-area">
            <div className="explore-user-meta">
                <p>Made For</p>
                <h1>{user.fullname}</h1>
            </div>
            <ul className="square-list">
                {stations.map(station =>
                    <li key={station._id} className="station-list-item">
                        <SquarePreview entity={station || []} />
                    </li>)
                }
            </ul>
        </section >
    )
}

