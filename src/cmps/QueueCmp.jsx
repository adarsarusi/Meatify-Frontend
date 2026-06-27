import { useSelector } from "react-redux"
import SongPreview from '../cmps/globalCmps/SongPreview.jsx'

export function QueueCmp() {
  const queue = useSelector((state) => state.playerModule.queue)
  const currentSong = useSelector((state) => state.playerModule.currentSong)

  return (
  <section className="queue-cmp">
    <h1>Queue List</h1>
    <ul>
      {queue.map(song => (
        <SongPreview key={song._id} song={song} />
      ))}
    </ul>
  </section>
)
}
