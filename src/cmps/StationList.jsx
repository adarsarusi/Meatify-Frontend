import { StationPreview } from "./StationPreview.jsx"
import { LikeBtn } from './LikeBtn'
import { SquarePreview } from './globalCmps/SquarePreview'
import { useSelector } from "react-redux"



export function StationList({ stations }) {

    const isExpanded = useSelector(
        storeState => storeState.systemModule.isExpanded
    )

    const isSquare = useSelector(
        storeState => storeState.systemModule.isSquare
    )

    return <ul className={isSquare ? 'station-list' : 'station-list demo-square-list'}>
        {stations.map(station =>
            <li key={station._id} className="station-list-item">
                {!isExpanded && isSquare && <>
                    <StationPreview station={station} />
                    <LikeBtn
                        itemId={station._id}
                        userField="likedStationIds"
                    />
                </>}

                {isExpanded && isSquare && <>
                    <StationPreview station={station} />
                    <LikeBtn
                        itemId={station._id}
                        userField="likedStationIds"
                    />
                </>
                }

                {!isExpanded && !isSquare &&
                    <SquarePreview entity={station} />}

                {isExpanded && !isSquare &&
                    <SquarePreview entity={station} />}

            </li>)
        }
    </ul>
}