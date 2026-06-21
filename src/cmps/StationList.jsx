import { StationPreview } from "./StationPreview.jsx"
import { LikeBtn } from './LikeBtn'

export function StationList({ stations }) {

    return <ul className="station-list">
        {stations.map(station =>
            <li key={station._id} className="station-list-item">
                <StationPreview station={station} />
                <LikeBtn
                    itemId={station._id}
                    userField="likedStationIds"
                />
            </li>)
        }
    </ul>
}