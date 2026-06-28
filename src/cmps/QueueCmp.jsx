import { useSelector } from "react-redux"
import { QueuePreview } from "./QueuePreview.jsx"

export function QueueCmp() {
  const queue = useSelector((state) => state.playerModule.queue)
  const currentSong = useSelector((state) => state.playerModule.currentSong)

  return (
    <section className="queue-cmp">
      <h1>Queue List</h1>
      <ul>
        {queue.map(song => (
          <QueuePreview key={song._id} song={song} />
        ))}
      </ul>
    </section>
  )
}
