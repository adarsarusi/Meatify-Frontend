import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"
import { songService } from "../services/song"

export function SongDetails() {
  const loggedInUser = useSelector((storeState) => storeState.userModule.user)
  const isLoading = useSelector(
    (storeState) => storeState.stationModule.isLoading,
  )

  const navigate = useNavigate()
  const { id } = useParams()
  const [song, setSong] = useState(null)

  useEffect(() => {
    if (!id) return
    loadSong()
  }, [id])

  async function loadSong() {
    try {
      const songId = await songService.getById(id)
      setSong(songId)
    } catch (err) {
      console.error("loadSong : Cannot load song", err)
    }
  }

  if (isLoading || !song) return <div>loading...</div>
  console.log(song);
  
  return (
    <section className="song-details dynamic-area">
      <h1 className="song-name">{song?.title}</h1>
    </section>
  )
}
