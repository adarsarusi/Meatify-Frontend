import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"

export function SquarePreview({ entity }) {
    
    const rawArtists = entity.type === 'station'
        ? [...new Set(entity.songs.flatMap(song => song.artists))]
        : (entity.artists || [])

    const displayArtists = rawArtists.length > 3
        ? [...rawArtists.slice(0, 3), 'and More'].join(', ')
        : rawArtists.join(', ')

    return (
        <article className="entity-square-preview__item">
            <div className="entity-square-preview__meta">
                <div className="entity-square-preview__img">
                    <StationCover entity={entity} />
                    <button className="entity-square-preview__btn entity-square-preview__btn--play btn-reset">
                        <IconComp name="play" />
                    </button>
                </div>
                <div className="entity-square-preview__meta-text">
                    <div className="entity-square-preview__title">
                        {entity.title || entity.name}
                    </div>
                    <div className="entity-square-preview__artists">
                        {displayArtists}
                    </div>
                </div>
            </div>
        </article>
    )
}