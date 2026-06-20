import { Icon } from "./icon"

export function SquarePreview({ entity }) {

console.log('entity: ', entity)
    return <article className="entity-square-preview__item">

        <div className="entity-square-preview__meta">
            <div className="entity-square-preview__img">
                {entity.imgUrl ? (
                    <img
                        src={Array.isArray(entity.imgUrl) && entity.imgUrl.length ? entity.imgUrl[0] : entity.imgUrl}
                        alt={entity.title || entity.name}
                    />
                ) : (
                    <div className="entity-square-preview__img-placeholder">♪</div>
                )}
                <button className="entity-square-preview__btn entity-square-preview__btn--play btn-reset">
                    <Icon name="play" />
                </button>
            </div>
            <div className='entity-square-preview__meta-text'>
                <div className="entity-square-preview__title">{entity.title || entity.name}</div>
                <div className="entity-square-preview__artists">{(entity.artists || []).join(', ')}</div>
            </div>
        </div>
    </article>
}


