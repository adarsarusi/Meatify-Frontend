import React from "react"
import { SquarePreview } from "./SquarePreview"
import { SongListTable } from "./SongListTable"
import { useSelector } from "react-redux"

export function SquareList({ entities = [], isOwner, isLibrary = false }) {
  if (!entities || entities.length === 0)
    return <div className="square-list square-list--empty">No entities</div>

  const isLoading = useSelector(storeState => storeState.systemModule.isLoading)

  if (isLoading) return

  return (
    <section className={`square-list ${isLibrary ? 'is-library': ''} `}>
      {!entities.length ? (
        <SquarePreview
          key={entities._id}
          entity={entities}
        />
      ) : (
        entities.map((entity) => (
          <SquarePreview
            key={entity._id}
            entity={entity}
            isLibrary={isLibrary}
          />
        ))
      )}
    </section>
  )
}