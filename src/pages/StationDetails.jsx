import { useEffect, useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  loadStation,
  updateStation,
  removeStation,
} from "../store/actions/station.actions"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"
import { TAGS_DATA } from '../services/station/station.service.local'

import { EditModal } from "../cmps/globalCmps/EditModal"
import { StationHeader } from "../cmps/globalCmps/StationHeader"
import SongList from "../cmps/globalCmps/SongList"
import { IconComp } from "../cmps/globalCmps/IconComp"

import { debounce } from "../services/util.service"
import { loadSongs } from "../store/actions/song.actions"

import { StationOptions } from "../cmps/globalCmps/StationOptions"
import { ScrollArea } from "../cmps/globalCmps/ScrollArea"

export function StationDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const user = useSelector((storeState) => storeState.userModule.user)

  const station = useSelector(
    (storeState) => storeState.stationModule.selectedStation,
  )
  const isLoading = useSelector(
    (storeState) => storeState.stationModule.isLoading,
  )
  const songs = useSelector((storeState) => storeState.songModule.songs)
  const loggedInUser = useSelector((storeState) => storeState.userModule.user)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSearchVisible, setIsSearchVisible] = useState(false)

  const [searchedSong, setSearchedSong] = useState("")
  const debouncedSearch = useRef(
    debounce((txt) => {
      loadSongs({ txt })
    }),
  ).current

  const likedStation = id === "likedSongs"
  const likedSongs = songs.filter((song) =>
    user?.likedSongIds?.includes(song._id),
  )

  useEffect(() => {
    if (!id) return
    loadStation(id)
  }, [id])

  useEffect(() => {
    if (!station) return
    console.log(station)

    if (station.songs?.length === 0) {
      setIsSearchVisible(true)
    } else {
      setIsSearchVisible(false)
    }
  }, [station])

  useEffect(() => {
    debouncedSearch(searchedSong)
    console.log(isSearchVisible)
  }, [searchedSong])

  function handleSearchChange({ target }) {
    const { value } = target
    setSearchedSong(value)
  }

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

  if (isLoading && !station)
    return (
      <section className="station-details">
        <div className="station-container">
          <div className="station-header">
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
              likedStation={likedStation}
              user={user}
              station={station}
              isOwner={isOwner}
              onRemoveStation={onRemoveStation}
              onEditStation={() => setIsEditOpen(true)}
            />
          </section>
          <div className="station-details__content">
            <section className="station-details__options dynamic-max-width">
              <StationOptions
                likedStation={likedStation}
                station={station}
                isOwner={isOwner}
                onRemoveStation={onRemoveStation}
                onEditStation={() => setIsEditOpen(true)}
              />
            </section>

            {isEditOpen && (
              <EditModal
                title="Edit playlist"
                entity={station}
                onClose={() => setIsEditOpen(false)}
                onSave={onSaveStation}
              />
            )}

            <section className="station-details__song-list dynamic-max-width">
              {!likedStation ? (
                <SongList songs={station?.songs || []} />
              ) : (
                <SongList songs={likedSongs} />
              )}

              {station.songs?.length > 0 && !isSearchVisible && (
                <button
                  className="station-details__find-more-btn"
                  onClick={() => setIsSearchVisible(true)}
                >
                  <span>Find more</span>
                </button>
              )}

              {(station.songs?.length === 0 || isSearchVisible) && (
                <div className="station-details__search-container">
                  <div>
                    <h2>Let's find something for your playlist</h2>
                    <div className="station-details__search-bar">
                      <span>
                        <IconComp name="search" />
                      </span>
                      <input
                        type="text"
                        placeholder="Search for songs..."
                        value={searchedSong}
                        onChange={handleSearchChange}
                      />
                    </div>
                  </div>
                  {station.songs?.length > 0 && (
                    <button onClick={() => setIsSearchVisible(false)}>
                      <span>
                        <IconComp name="close" />
                      </span>
                    </button>
                  )}
                </div>
              )}
              {isSearchVisible && searchedSong && (
                <div className="station-details__search-results">
                  <SongList songs={songs} isSearchResult={true} />
                </div>
              )}
            </section>
          </div>
        </section>
      </ScrollArea>
    </section>
  )

}

