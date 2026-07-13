import { useMemo } from "react"
import { useSelector } from "react-redux"
import { SquareList } from "../cmps/globalCmps/SquareList"
import { ScrollArea } from "../cmps/globalCmps/ScrollArea"
import { getMostCommonTags } from "../services/util.service"

export function Explore() {
  const stations = useSelector((storeState) => storeState.stationModule.stations) || []
  const songs = useSelector((storeState) => storeState.songModule.songs) || []
  const loggedinUser = useSelector((storeState) => storeState.userModule.user)

  if (!stations) {
    return (
      <section className="station-details">
        <div className="station-container">
          <div className="station-header">
            <p>Loading stations...</p>
          </div>
        </div>
      </section>
    )
  }

  const likedSongs = useMemo(() =>
    songs.filter((song) => loggedinUser?.likedSongIds?.includes(song._id)),
    [songs, loggedinUser?.likedSongIds],
  )

  const discoverableStations = useMemo(() =>
    stations.filter(
      (station) =>
        !station.tags?.includes("Liked") &&
        station.createdBy?._id !== loggedinUser?._id,
    ),
    [stations, loggedinUser?._id],
  )

  // recommended for you - based on common tags in user's liked songs
  const favoriteTags = useMemo(() => getMostCommonTags(likedSongs), [likedSongs])

  const recommendations = useMemo(() =>
    stations
      .filter((station) =>
        station.tags?.some((tag) => favoriteTags.includes(tag)),
      )
      .slice(0, 12),
    [stations, favoriteTags],
  )

  // popular stations, sorted by savedCount
  const popularStations = useMemo(() =>
    [...discoverableStations]
      .sort((a, b) => (b.savedCount ?? 0) - (a.savedCount ?? 0))
      .slice(0, 12),
    [discoverableStations],
  )

  // new releases sorted by created at
  const newStations = useMemo(() =>
    [...discoverableStations]
      .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
      .slice(0, 12),
    [discoverableStations],
  )

  return (
    <section className="explore dynamic-area">
      <ScrollArea>
        <div className="explore--container dynamic-max-width">
          {recommendations.length > 0 && (
            <div className="explore__stations-grid">
              <div className="explore-sub-header">
                <h1 className="explore-sub-header__title">Recommended For You</h1>
                <p className="explore-sub-header__sub-title">
                  Based on your liked songs
                </p>
              </div>

              <div className="explore__stations-list">
                <SquareList stations={recommendations} />
              </div>
            </div>
          )}

          <div className="explore__stations-grid">
            <div className="explore-sub-header">
              <h1 className="explore-sub-header__title">Popular Stations</h1>
              <p className="explore-sub-header__sub-title">Most saved</p>
            </div>

            <div className="explore__stations-list">
              <SquareList stations={popularStations} />
            </div>
          </div>

          <div className="explore__stations-grid">
            <div className="explore-sub-header">
              <h1 className="explore-sub-header__title">New Releases</h1>
            </div>

            <div className="explore__stations-list">
              <SquareList stations={newStations} />
            </div>
          </div>
        </div>
      </ScrollArea>
    </section>
  )
}