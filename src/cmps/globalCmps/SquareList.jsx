import React from "react"
import { SquarePreview } from "./SquarePreview"
import { SongListTable } from "./SongListTable"

export function SquareList({ entities = [], isOwner }) {
  if (!entities || entities.length === 0)
    return <div className="square-list square-list--empty">No entities</div>

  return (
    <section className="square-list">
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
          />
        ))
      )}
    </section>
  )
}