
export function StationPreview({ station }) {

    return <article className="station-preview">

        {station.songs?.length ? (
            <img src={station.songs[0].imgUrl} alt="" />
        ) : (
            <div className="playlist-placeholder">
                ♪
            </div>
        )}

        <div className="station-info">
            <h4>{station.name}</h4>
            <h5>By: {station.createdBy.fullname} · {station.savedCount} saves </h5>
        </div>

    </article>

}