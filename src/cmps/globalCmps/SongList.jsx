import React, { useState, useEffect, useRef } from "react"
import { SongPreview } from "./SongPreview"
import { SongListTable } from "./SongListTable"

import { DragDropProvider } from '@dnd-kit/react'
import { move } from '@dnd-kit/helpers'

export function SongList({
  songs = [],
  isSortable = false,
  onReorder = null,
  isSearchResult = false,
}) {
  const [items, setItems] = useState(songs)
  const isDragging = useRef(false)

  useEffect(() => {
    if (!isDragging.current) setItems(songs)
  }, [songs])

  if (!items || items.length === 0) {
    return <div className="song-list song-list--empty">No songs</div>
  }

  if (!isSortable) {
    return (
      <section className="song-list">
        {!isSearchResult && <SongListTable />}
        {items.map((song, index) => (
          <SongPreview
            key={song._id}
            song={song}
            index={index}
            isSearchResult={isSearchResult}
          />
        ))}
      </section>
    )
  }

  async function handleDragEnd(event) {
    isDragging.current = false
    if (event.canceled) return

    const previous = items
    const reordered = move(items, event)
    setItems(reordered)

    try {
      await onReorder?.(reordered.map(song => song._id.toString()))
    } catch {
      setItems(previous)
    }
  }

  return (
    <DragDropProvider
      onDragStart={() => { isDragging.current = true }}
      onDragEnd={handleDragEnd}
    >
      <section className="song-list">
        {!isSearchResult && <SongListTable />}
        {items.map((song, index) => (
          <SongPreview
            key={song._id}
            song={song}
            index={index}
            isSortable
            isSearchResult={isSearchResult}
          />
        ))}
      </section>
    </DragDropProvider>
  )
}