import { useSelector, useDispatch } from "react-redux"
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { setQueue } from "../store/actions/player.actions.js"

import { QueuePreview } from "./QueuePreview.jsx"
import { store } from "../store/store.js"
import { IconComp } from "./globalCmps/IconComp.jsx"
import { TOGGLE_OPEN_QUEUE } from "../store/reducers/system.reducer.js"
import { ScrollArea } from "./globalCmps/ScrollArea.jsx"
import { useEffect, useRef, useState } from "react"
import { REMOVE_FROM_QUEUE, SET_QUEUE } from "../store/reducers/player.reducer.js"

export function QueueCmp() {
  const queue = useSelector((storeState) => storeState.playerModule.queue)
  const currentSong = useSelector((storeState) => storeState.playerModule.currentSong)
  const isQueueOpened = useSelector((storeState) => storeState.systemModule.isQueueOpened)
  const isPlaying = useSelector(
    (storeState) => storeState.playerModule.isPlaying,
  )
  const [originalQueue, setOriginalQueue] = useState([])

  const currPlayingStation = useSelector(storeState => storeState.playerModule.currPlayingStation)

  const nextSongs = queue.filter(song => song._id !== currentSong?._id)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )


  function onToggleQueue() {
    store.dispatch({ type: TOGGLE_OPEN_QUEUE, isQueueOpened: !isQueueOpened })
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return
    if (active.id === over.id) return

    const oldIndex = queue.findIndex(song => song._id === active.id)
    const newIndex = queue.findIndex(song => song._id === over.id)

    const updatedQueue = arrayMove(queue, oldIndex, newIndex)

    setQueue(updatedQueue)
  }

  return (
    <section className="queue-cmp">
      <div className={`queue-cmp__container ${isQueueOpened ? 'is-open' : ''}`}>

        <div className="queue-cmp__header">
          <h1>Queue</h1>
          <button className="btn hover-bg" onClick={onToggleQueue}>
            <IconComp name="close" className="icon--sm icon--muted" />
          </button>
        </div>
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext items={nextSongs.map(song => song._id)} strategy={verticalListSortingStrategy}>
            <div className="queue-cmp__list-container">
              <ScrollArea>
                <ul className="queue-cmp__list">
                  <div className="queue-cmp__now-playing">
                    <p>Now Playing</p>
                    <QueuePreview key={song._id} song={song} />
                  </div>
                  <p>Next from: {currPlayingStation?.name} </p>
                  {queue
                    .filter(song => song._id !== currentSong?._id)
                    .map(song => (
                      <QueuePreview key={song._id} song={song} />
                    ))
                  }
                </ul>
              </ScrollArea>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  )
}