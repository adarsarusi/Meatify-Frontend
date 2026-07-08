import { makeId } from "../../services/util.service"
import { IconComp } from "./IconComp"

export function StationCover({ entity }) {
    if (!entity) return null

    const isMediaType = ['artist', 'album', 'song'].includes(entity.type)

    const coverImg =
        entity.uploadImgUrl ||
        entity.imgUrl

    return (
        <article className="station-cover">
            <div className="station-cover-img">
                <div className="station-cover__hover"></div>
                {entity?.uploadImgUrl ? (
                    <img src={entity.uploadImgUrl} alt='' />
                ) : isMediaType ? (
                    <img src={entity.imgUrl} alt={entity.name || ''} />
                ) : entity.songsImagesUrls?.length ? (
                    <div className="station-cover-img__container">
                        {entity.songsImagesUrls.map((url, index) => (
                            <img key={index}
                                src={url}
                                alt={entity.name || ''}
                                className="station-img"
                            />
                        ))}
                    </div>
                ) : (
                    <div className="playlist-placeholder">
                        <IconComp
                            name="music"
                            className="icon--xl icon--muted"
                        />
                    </div>
                )}
            </div>
        </article>
    )
}