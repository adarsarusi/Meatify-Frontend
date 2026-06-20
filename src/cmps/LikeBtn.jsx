import { useState } from 'react'
import { useSelector } from 'react-redux'

import { Icon } from './globalCmps/icon'

import { updateUser } from '../store/actions/user.actions'
import { showSuccessMsg } from '../services/event-bus.service'

export function LikeBtn({ song }) {
    const loggedinUser = useSelector(
        state => state.userModule.user
    )

    const isLiked =
        loggedinUser?.likedSongIds?.includes(song._id)

    async function toggleLike() {
        const updatedUser = {
            ...loggedinUser,
            likedSongIds: isLiked
                ? loggedinUser.likedSongIds.filter(
                    id => id !== song._id
                )
                : [...loggedinUser.likedSongIds, song._id]
        }

        await updateUser(updatedUser)
    }

    return (
        <button
            onClick={toggleLike}
            className="icon-btn"
        >
            <Icon
                name={isLiked ? 'added' : 'like'}
                className="icon--sm"
            />
        </button>
    )
}