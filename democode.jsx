export function toggleShuffleQueue() {
    try {
        // Get the current player state from Redux
        const state = store.getState()
        const { queue, originalQueue, currentSong, isShuffle } = state.playerModule

        // Nothing to shuffle
        if (!queue.length) return

        if (!isShuffle) {
            // Save the original queue so it can be restored later
            const cleanOriginalQueue = [...queue]

            // Remove the current song before shuffling
            const rest = cleanOriginalQueue.filter(
                (song) => song._id !== currentSong?._id,
            )

            // Shuffle the remaining songs
            const shuffledRest = shuffle(rest)

            // Keep the current song playing at the beginning
            const shuffledQueue = currentSong
                ? [currentSong, ...shuffledRest]
                : shuffledRest

            // Update Redux state
            store.dispatch({ type: SET_ORIGINAL_QUEUE, songs: cleanOriginalQueue })
            store.dispatch({ type: SET_QUEUE, songs: shuffledQueue })
            store.dispatch({ type: TOGGLE_IS_SHUFFLE, isShuffle: true })
        } else {
            // Restore the original queue when Shuffle is turned off
            const restoredQueue = originalQueue.length
                ? [...originalQueue]
                : [...queue]

            // Update Redux state
            store.dispatch({ type: SET_QUEUE, songs: restoredQueue })
            store.dispatch({ type: TOGGLE_IS_SHUFFLE, isShuffle: false })
        }
    } catch (err) {
        console.log("Cannot toggle shuffle", err)
        throw err
    }
}

export function shuffle(array) {
    // Creates a copy to avoid mutating the original array
    const shuffled = [...array]

    // Shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    return shuffled
}