import { useSelector, useDispatch } from "react-redux"
import { DndContext } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { setQueue } from "../store/actions/player.actions.js"

import { QueuePreview } from "./QueuePreview.jsx"
import { store } from "../store/store.js"
import { IconComp } from "./globalCmps/IconComp.jsx"
import { TOGGLE_OPEN_QUEUE } from "../store/reducers/system.reducer.js"
import { ScrollArea } from "./globalCmps/ScrollArea.jsx"


export function QueueCmp() {
  const queue = useSelector((state) => state.playerModule.queue)
  const currentSong = useSelector((state) => state.playerModule.currentSong)
  const isQueueOpened = useSelector((storeState) => storeState.systemModule.isQueueOpened)

  function onToggleQueue() {
    console.log(': ',)
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
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={queue.map(song => song._id)} strategy={verticalListSortingStrategy}>
            <ScrollArea>
              <div className="queue-cmp__list">
                <ul>

                  {queue.map(song => (
                    <QueuePreview key={song._id} song={song} />
                  ))}

                </ul>
              </div>
            </ScrollArea>
          </SortableContext>
        </DndContext>
      </div>
    </section>
  )

}

