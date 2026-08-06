import { useSelector } from 'react-redux'

import { updateUser } from '../store/actions/user.actions'
import { IconComp } from './globalCmps/IconComp'

import { addSongToStation, removeSongFromStation, addStationLikes, removeStationLikes } from '../store/actions/station.actions'
import { store } from '../store/store'

export function LikeBtn({ itemId, userField, iconSize = 'icon--size', className = '' }) {

    const stations = useSelector(storeState => storeState.stationModule.stations)

    const loggedinUser = useSelector(
        storeState => storeState.userModule.user
    )

    const likedSongsStation = stations.find(
        station => station?.tags?.includes("Liked")
    )

    const likedBy = {
        userId: loggedinUser._id,
        isPinned: false
    }

    if (!loggedinUser) return null

    const likedIds = loggedinUser[userField] || []

    const isLiked = likedIds.includes(itemId)

    async function toggleLike(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        try {
            const newLikedIds = isLiked
                ? likedIds.filter(id => id !== itemId)
                : [itemId, ...likedIds]

            const updatedUser = {
                ...loggedinUser,
                [userField]: newLikedIds
            }

            if (userField === 'likedStationIds') {
                console.log('isLiked: ', isLiked)
                if (isLiked) {
                    await removeStationLikes(itemId, likedBy)
                } else {
                    await addStationLikes(itemId, likedBy)
                }

            }

            const promises = [updateUser(updatedUser)]

            if (userField === 'likedSongIds' && likedSongsStation) {
                if (isLiked) {
                    promises.push(removeSongFromStation(likedSongsStation._id, itemId))
                } else {
                    promises.push(addSongToStation(likedSongsStation._id, itemId))
                }
            }

            await Promise.all(promises)

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