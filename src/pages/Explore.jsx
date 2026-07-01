import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { SquareList } from "../cmps/globalCmps/SquareList"
import { SquarePreview } from "../cmps/globalCmps/SquarePreview"
import { ScrollArea } from "../cmps/globalCmps/ScrollArea"
import { setQueue, setCurrentSong } from "../store/actions/player.actions"

import { getMostCommonTags } from "../services/util.service"
import { useEffect } from "react"

export function Explore() {
  const navigate = useNavigate()
  const stations = useSelector(
    (storeState) => storeState.stationModule.stations,
  )
  const songs = useSelector((storeState) => storeState.songModule.songs)
  const isLoading = useSelector(
    (storeState) => storeState.stationModule.isLoading,
  )
  const loggedinUser = useSelector((storeState) => storeState.userModule.user)
  const likedStation = useSelector(
    (storeState) => storeState.stationModule.userLikedStation,
  )

  const likedSongs = songs.filter((song) =>
    loggedinUser?.likedSongIds?.includes(song._id),
  )


  if (isLoading && !stations)
    return (
      <section className="station-details">
        <div className="station-container">
          <div className="station-header">
            <p>Loading stations...</p>
          </div>
        </div>
      </section>
    )

  const discoverableStations = stations.filter(
    (station) =>
      station._id !== "likedSongs" &&
      station.createdBy?._id !== loggedinUser?._id,
  )

  // recommended for you - based on common tags in user's liked songs

  const favoriteTags = getMostCommonTags(likedSongs)

  const recommendations = stations
    .filter((station) =>
      station.tags?.some((tag) => favoriteTags.includes(tag)),
    )
    .slice(0, 6)

  // popular stations, sorted by savedCount
  const popularStations = [...discoverableStations]
    .sort((a, b) => (b.savedCount ?? 0) - (a.savedCount ?? 0))
    .slice(0, 6)

  // new releases sorted by created at
  const newStations = [...discoverableStations]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 6)

  // surprise me btn - plays a random station
  const randomStation =
    discoverableStations[
    Math.floor(Math.random() * discoverableStations.length)
    ]

  return (
    <section className="explore dynamic-area">
      <ScrollArea>
        <div className="explore__stations-grid">
          <div className="explore-sub-header">
            <p className="explore-sub-header__sub-title">Made For</p>
            <h1 className="explore-sub-header__title">
              {loggedinUser.fullname}
            </h1>
          </div>

          <ul className="explore__stations-list">
            <SquareList entities={likedStation} />

          </ul>
        </div>

        {recommendations.length > 0 && (
          <div className="explore__stations-grid">
            <div className="explore-sub-header">
              <h1 className="explore-sub-header__title">Recommended For You</h1>
              <p className="explore-sub-header__sub-title">
                Based on your liked songs
              </p>
            </div>

            <ul className="explore__stations-list">
              <SquareList entities={recommendations} />
            </ul>
          </div>
        )}

        <div className="explore__stations-grid">
          <div className="explore-sub-header">
            <h1 className="explore-sub-header__title">Popular Stations</h1>
            <p className="explore-sub-header__sub-title">Most saved</p>
          </div>

          <ul className="explore__stations-list">
            <SquareList entities={popularStations} />
          </ul>
        </div>

        <div className="explore__stations-grid">
          <div className="explore-sub-header">
            <h1 className="explore-sub-header__title">New Releases</h1>
          </div>

          <ul className="explore__stations-list">
            <SquareList entities={newStations} />
          </ul>
        </div>


      </ScrollArea>
    </section >
  )
}
