import React from "react"
import { SongPreview } from "./SongPreview"
import { SongListTable } from "./SongListTable"

import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'

export function SongList({
  songs = [],
  isSortable = false,
  onReorder = null,
  isSearchResult = false,
}) {
  if (!songs || songs.length === 0)
    return <div className="song-list song-list--empty">No songs</div>

  const ids = songs.map(song => song._id.toString())

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = ids.findIndex(id => id === active.id)
    const newIndex = ids.findIndex(id => id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const updatedIds = arrayMove(ids, oldIndex, newIndex)

    if (onReorder) onReorder(updatedIds)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <section className="song-list">
          {!isSearchResult && <SongListTable />}
          {songs.map((song, index) => (
            <SongPreview
              key={song._id}
              song={song}
              index={index + 1}
              isSearchResult={isSearchResult}
            />
          ))}
        </section>
      </SortableContext>
    </DndContext>
  )
}
