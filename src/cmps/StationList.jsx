import { StationPreview } from "./StationPreview.jsx"
import { SquarePreview } from './globalCmps/SquarePreview'
import { useSelector } from "react-redux"



export function StationList({ stations }) {

    return (
        <ul className="station-list">
            {stations.map(station => (
                <li key={station._id} className="station-list__item">
                    <StationPreview station={station} />
                </li>
            ))}
        </ul>
    )
}