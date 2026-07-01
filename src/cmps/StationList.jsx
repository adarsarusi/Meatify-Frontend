import { StationPreview } from "./StationPreview.jsx"
import { LikeBtn } from './LikeBtn'
import { SquarePreview } from './globalCmps/SquarePreview'
import { useSelector } from "react-redux"



export function StationList({ stations }) {

    const isExpanded = useSelector(storeState => storeState.systemModule.isExpanded)
    const isSquare = useSelector(storeState => storeState.systemModule.isSquare)

    const showSquareView = isExpanded || isSquare

    return (
        <ul className={showSquareView ? 'station-list station-list--square-view' : 'station-list'}>
            {stations.map(station => (
                <li key={station._id} className="station-list__item">
                    {showSquareView ? (
                        <SquarePreview entity={station} />
                    ) : (
                        <StationPreview station={station} />
                    )}
                </li>
            ))}
        </ul>
    )
}