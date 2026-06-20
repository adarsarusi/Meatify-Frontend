import { useSelector } from 'react-redux'

import { updateUser } from '../store/actions/user.actions'
import { Icon } from './globalCmps/icon'

export function LikeBtn({ itemId, userField }) {
    const loggedinUser = useSelector(
        state => state.userModule.user
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
        } catch (err) {
            console.error('Cannot update likes', err)
        }
    }

    return (
        <button
            onClick={toggleLike}
            className={`icon-btn like-btn ${isLiked ? 'no-hover' : ''} `}
        >
            <Icon
                name={isLiked ? 'added' : 'like'}
                className={`${isLiked ? 'icon--active' : ''} icon--muted`}
            />
        </button>
    )
}