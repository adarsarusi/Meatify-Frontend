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