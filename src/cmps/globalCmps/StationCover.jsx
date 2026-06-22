import { makeId } from "../../services/util.service"
import { IconComp } from "./IconComp"

export function StationCover({ entity }) {

    const isMediaType = ['artist', 'album', 'song'].includes(entity?.type)

    return (
        <article>
            {entity?.uploadImgUrl ? (
                <img src={entity?.uploadImgUrl} alt='' />
            ) : isMediaType ? (
                <img src={entity?.imgUrl} alt='' />
            ) : (
                <div className="station-cover-img__container">
                    {entity?.songsImagesUrls?.length ? (
                        entity?.songsImagesUrls.map((url) => (
                            <img key={makeId('img')} src={url} alt={entity?.name ?? ''} className="station-img" />
                        ))
                    ) : (
                        <div className="playlist-placeholder">
                            <IconComp className='icon--xl icon--muted' />
                        </div>
                    )}
                </div>
            )}
        </article>
    )
}