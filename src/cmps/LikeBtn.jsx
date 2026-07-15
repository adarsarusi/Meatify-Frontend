import { useSelector } from 'react-redux'

import { updateUser } from '../store/actions/user.actions'
import { IconComp } from './globalCmps/IconComp'

import { addSongToStation, removeSongFromStation } from '../store/actions/station.actions'

export function LikeBtn({ itemId, userField, iconSize = 'icon--size', className = '' }) {

    const stations = useSelector(storeState => storeState.stationModule.stations)

    const loggedinUser = useSelector(
        storeState => storeState.userModule.user
    )

    const likedSongsStation = stations.find(
        station => station?.tags?.includes("Liked")
    )

    if (!loggedinUser) return null

    const likedIds = loggedinUser[userField] || []

    const isLiked = likedIds.includes(itemId)

    async function toggleLike() {
        try {
            const updatedUser = {
                ...loggedinUser,
                [userField]: isLiked
                    ? likedIds.filter(id => id !== itemId)
                    : [...likedIds, itemId]
            }

            await updateUser(updatedUser)

            // Only for songs
            if (userField === 'likedSongIds' && likedSongsStation) {
                if (isLiked) {
                    await removeSongFromStation(
                        likedSongsStation._id,
                        itemId
                    )
                } else {
                    await addSongToStation(
                        likedSongsStation._id,
                        itemId
                    )
                }
            }

        } catch (err) {
            console.error('Cannot update likes', err)
        }
    }

    return (
        <button
            onClick={toggleLike}
            className={`btn ${isLiked ? 'no-hover' : ''} ${className}`.trim()}
            onPointerDown={(ev) => ev.stopPropagation()}
        >
            <IconComp
                name={isLiked ? 'added' : 'like'}
                className={`${isLiked ? 'icon--active' : ''} icon--muted ${iconSize}`}
            />
        </button>
    )
}