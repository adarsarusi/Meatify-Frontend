import { useNavigate } from 'react-router-dom'
import { IconComp } from './globalCmps/IconComp'
import { StationCover } from './globalCmps/StationCover'

export function StationPreview({ station }) {

    const navigate = useNavigate()

    return <article className="station-preview">

        <StationCover entity={station} />

        <div className="station-preview__info" onClick={() => navigate(`/station/${station._id}`)}>
            <h4>{station.name}</h4>
            <h5>By: {station.createdBy.fullname} · {station.savedCount} saves </h5>
        </div>

    </article>

}