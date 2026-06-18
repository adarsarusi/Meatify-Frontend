import { useNavigate } from 'react-router-dom'

export function StationPreview({ station }) {

    const navigate = useNavigate()

    return <article className="station-preview">

        {station.imgUrl? (
            <img src={station.imgUrl[0]} alt="" />
        ) : (
            <div className="playlist-placeholder">
                ♪
            </div>
        )}

        <div className="station-preview__info" onClick={() => navigate(`/station/${station._id}`)}>
            <h4>{station.name}</h4>
            <h5>By: {station.createdBy.fullname} · {station.savedCount} saves </h5>
        </div>

    </article>

}