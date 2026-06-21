import { IconComp } from "./IconComp"
import { StationCover } from "./StationCover"

export function SquarePreview({ entity }) {

    return <article className="entity-square-preview__item">

        <div className="entity-square-preview__meta">
            <div className="entity-square-preview__img">
                <StationCover entity={entity} />
                <button className="entity-square-preview__btn entity-square-preview__btn--play btn-reset">
                    <IconComp name="play" />
                </button>
            </div>
            <div className='entity-square-preview__meta-text'>
                <div className="entity-square-preview__title">{entity.title || entity.name}</div>
                <div className="entity-square-preview__artists">{(entity.artists || []).join(', ')}</div>
            </div>
        </div>
    </article>
}



