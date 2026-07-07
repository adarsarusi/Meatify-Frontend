import React from "react"
import SongPreview from "./SongPreview"
import { SongListTable } from "./SongListTable"

import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

export function SongList({ songs = [], isOwner, isSortable = false, onReorder = null }) {
  if (!songs || songs.length === 0)
    return <div className="song-list song-list--empty">No songs</div>

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return
    if (active.id === over.id) return

    const oldIndex = songs.findIndex(song => song._id === active.id)
    const newIndex = songs.findIndex(song => song._id === over.id)

    const updatedSongs = arrayMove(songs, oldIndex, newIndex)

    if (onReorder) {
      onReorder(updatedSongs)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={songs.map(song => song._id)} strategy={verticalListSortingStrategy}>
        <section className="song-list">
          {/* <SongListTable /> */}
          {songs.map((song, index = 0) => (
            <SongPreview
              key={song._id || index}
              song={song}
              index={index + 1}
            />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  )
}

export default SongList
