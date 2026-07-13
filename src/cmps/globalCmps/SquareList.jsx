import React from "react"
import { SquarePreview } from "./SquarePreview"
import { useSelector } from "react-redux"

export function SquareList({ stations = [], isOwner, isLibrary = false }) {
  const songs = useSelector((storeState) => storeState.songModule.songs)
  const isExpanded = useSelector(storeState => storeState.systemModule.isExpanded)

  if (!stations) return <div className="square-list loader">Loading...</div>

  if (!stations || stations.length === 0) {
    return <div className="square-list square-list--empty">No stations</div>
  }

  return (
    <section className={`square-list ${isLibrary && !isExpanded ? 'is-library' : ''}`}>
      {stations.map((station) => {
        const stationSongs = songs.filter(song =>
          station?.songs?.includes(song._id.toString())
        )

        return (
          <SquarePreview
            key={station._id}
            station={station}
            stationSongs={stationSongs}
            isLibrary={isLibrary}
          />
        )
      })}
    </section>
  )
}