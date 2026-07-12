import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  loadStation,
  updateStation,
  removeStation,
} from "../store/actions/station.actions"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"
import { TAGS_DATA } from '../services/station'

import { EditModal } from "../cmps/globalCmps/EditModal"
import { StationHeader } from "../cmps/globalCmps/StationHeader"
import { SongList } from "../cmps/globalCmps/SongList"
import { IconComp } from "../cmps/globalCmps/IconComp"

import { debounce } from "../services/util.service"
import { loadSongs } from "../store/actions/song.actions"

import { StationOptions } from "../cmps/globalCmps/StationOptions"
import { ScrollArea } from "../cmps/globalCmps/ScrollArea"
import { StationSearchMore } from "../cmps/StationSearchMore"
import { LoadingAnimation } from "../cmps/globalCmps/LoadingAnimation"

export function StationDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const user = useSelector((storeState) => storeState.userModule.user)

  const station = useSelector(
    (storeState) => storeState.stationModule.selectedStation,
  )

  const selectedStationId = useSelector(
    (storeState) => storeState.stationModule.selectedStation?._id,
  )

  const songs = useSelector((storeState) => storeState.songModule.songs)
  const loggedInUser = useSelector((storeState) => storeState.userModule.user)

  const [isEditOpen, setIsEditOpen] = useState(false)

  const isLikedStation = station?.tags?.includes("Liked")

  const likedSongs = useMemo(() => {
    if (!Array.isArray(songs) || !Array.isArray(user?.likedSongIds)) return []
    return songs.filter(song => user.likedSongIds.includes(song._id.toString()))
  }, [songs, user?.likedSongIds])

  const stationSongs = useMemo(() => {
    if (!station?.songs?.length || !Array.isArray(songs)) return []
    const stationSongIds = new Set(station.songs.map(id => id.toString()))
    return songs.filter(song => stationSongIds.has(song._id.toString()))
  }, [songs, station?.songs])


  useEffect(() => {
    if (!id || selectedStationId === id) return
    loadStation(id)
  }, [id, selectedStationId])


  async function onSaveStation(updatedStation) {
    try {
      await updateStation(updatedStation)

      showSuccessMsg("Playlist updated")
    } catch (err) {
      console.log(err)
      showErrorMsg("Couldn't update playlist")
    }
  }

  async function onRemoveStation() {
    const isConfirmed = confirm(`Delete "${station.name}"?`)

    if (!isConfirmed) return

    try {
      await removeStation(station._id)

      showSuccessMsg("Station removed")
      navigate("/")
    } catch (err) {
      console.log("Cannot remove station", err)
      showErrorMsg("Couldn't remove station")
    }
  }

  function handleReorderSongs(updatedSongs) {
    const updatedStation = {
      ...station,
      songs: updatedSongs,
    }

    updateStation(updatedStation)
  }

  if (!station && selectedStationId !== id)
    return (
      <section className="station-details">
        <div className="station-container">
          <div className="station-header">
            <LoadingAnimation />
            <p>Loading station...</p>
          </div>
        </div>
      </section>
    )
  if (!station) {
    return (
      <section className="station-details">
        <ScrollArea>
          <div className="station-container">
            <div className="station-header">
              <LoadingAnimation />
              <p>Station not found</p>
            </div>
          </div>
        </ScrollArea>
      </section>
    )
  }

  const isOwner = loggedInUser?._id === station.createdBy?._id

  const tagData = TAGS_DATA.find(
    currTag => currTag.title === station.tags[0]
  )

  return (
    <section className="station-details dynamic-area"
      style={{
        '--tag-color': tagData?.color || '#509BF5',
      }}>
      <ScrollArea>
        <section className="station-details__container">
          <section className="station-details__header">
            <StationHeader
              user={user}
              stationSongs={stationSongs}
              station={station}
              isOwner={isOwner}
              onRemoveStation={onRemoveStation}
              onEditStation={() => setIsEditOpen(true)}
            />
          </section>
          <div className="station-details__content">
            <section className="station-details__options dynamic-max-width">
              <StationOptions
                stationSongs={stationSongs}
                station={station}
                isOwner={isOwner}
                onRemoveStation={onRemoveStation}
                onEditStation={() => setIsEditOpen(true)}
              />
            </section>

            {isEditOpen && (
              <EditModal
                title="Edit station"
                entity={station}
                onClose={() => setIsEditOpen(false)}
                onSave={onSaveStation}
              />
            )}

            <section className="station-details__song-list dynamic-max-width">

              {isLikedStation ?
                <SongList
                  songs={likedSongs || []}
                  isSortable
                  onReorder={handleReorderSongs}
                />
                :
                <SongList
                  songs={stationSongs || []}
                  isSortable
                  onReorder={handleReorderSongs}
                />
              }

              <StationSearchMore station={station} songs={songs} />
            </section>
          </div>
        </section>
      </ScrollArea>
    </section>
  )
}

