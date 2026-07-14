import { useState, useEffect, useMemo } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addStation, loadStations } from "../store/actions/station.actions"
import { updateUser } from "../store/actions/user.actions.js"
import { loadSongs } from "../store/actions/song.actions.js"
import { showSuccessMsg, showErrorMsg } from "../services/event-bus.service"

import { stationService } from "../services/station/"
import { StationList } from "./StationList"
import { StationFilter } from "./StationFilter.jsx"
import { TOGGLE_EXPAND_LIBRARY } from "../store/reducers/system.reducer.js"
import { store } from "../store/store.js"
import { IconComp } from "./globalCmps/IconComp.jsx"
import { ScrollArea } from "./globalCmps/ScrollArea.jsx"
import { SquareList } from "./globalCmps/SquareList.jsx"

export function Library() {
  const navigate = useNavigate()
  const stations = useSelector(
    (storeState) => storeState.stationModule.stations,
  )

  const [filterBy, setFilterBy] = useState({ txt: "" })

  const songs = useSelector((storeState) => storeState.songModule.songs)
  const isSquare = useSelector((storeState) => storeState.systemModule.isSquare)

  const loggedinUser = useSelector((storeState) => storeState.userModule.user)
  const isExpanded = useSelector(
    (storeState) => storeState.systemModule.isExpanded,
  )

  const likedSongs = useMemo(
    () =>
      songs.filter((song) => loggedinUser?.likedSongIds?.includes(song._id)),
    [songs, loggedinUser?.likedSongIds],
  )

  const libraryStations = useMemo(
    () =>
      stations.filter(
        (station) =>
          station.createdBy?._id === loggedinUser?._id ||
          loggedinUser?.likedStationIds?.includes(station._id),
      ),
    [stations, loggedinUser?._id, loggedinUser?.likedStationIds],
  )

  function onExpand() {
    store.dispatch({ type: TOGGLE_EXPAND_LIBRARY, isExpanded: !isExpanded })
  }

  useEffect(() => {
    loadSongs()
  }, [])

  useEffect(() => {
    loadStations(filterBy)
  }, [filterBy])

  async function onCreateStation() {
    const station = stationService.getEmptyStation()

    try {
      const savedStation = await addStation(station)

      await updateUser({
        ...loggedinUser,
        likedStationIds: [
          ...(loggedinUser.likedStationIds || []),
          savedStation._id,
        ],
      })

      showSuccessMsg("Station added!")
      navigate(`/station/${savedStation._id}`)
    } catch (err) {
      console.log("Could not create station", err)
      showErrorMsg("Couldn't add station")
    }
  }

  return (
    <section className="app-library">
      <div className="library-header">
        <h3 className="library-header__title">Your Library</h3>

        <section className="library-controls">
          <button onClick={onCreateStation} className="btn bg-button">
            <IconComp name="create" className="icon--sm icon--muted" />
            <span className="btn-text">Create</span>
          </button>
          <button onClick={onExpand} className="btn hover-bg">
            {isExpanded ? (
              <IconComp name="unexpend" className="icon--sm icon--muted" />
            ) : (
              <IconComp name="expend" className="icon--sm icon--white" />
            )}
          </button>
        </section>
      </div>

      <div className="filter">
        <StationFilter filterBy={filterBy} setFilterBy={setFilterBy} />
      </div>

      <ScrollArea>
        <div
          className={
            isExpanded || isSquare
              ? "library-content library-content--expanded"
              : "library-content"
          }
        >
          {isSquare ? (
            <SquareList
              stations={libraryStations}
              isOwner={true}
              isLibrary={true}
            />
          ) : (
            <StationList stations={libraryStations} />
          )}
        </div>
      </ScrollArea>
    </section>
  )
}
