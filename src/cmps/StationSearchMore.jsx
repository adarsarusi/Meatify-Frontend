import { IconComp } from "./globalCmps/IconComp"
import { SongList } from "./globalCmps/SongList"
import { debounce } from "../services/util.service"
import { useEffect, useRef, useState } from "react"
import { loadSearchSongs } from "../store/actions/song.actions"
import { useSelector } from "react-redux"

export function StationSearchMore({ station, songs }) {

    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [searchInput, setSearchInput] = useState("")

    const searchSongs = useSelector(
        store => store.songModule.searchSongs
    )


    const currentStation = useSelector(
        (storeState) => storeState.stationModule.selectedStation,
    )

    const loggedinUser = useSelector(
        storeState => storeState.userModule.user
    )

    const songsInStation = songs.filter(song =>
        station?.songs.includes(song._id.toString())
    )

    const isOwner = currentStation.createdBy.fullname === loggedinUser.fullname

    const debouncedSearch = useRef(
        debounce((txt) => {
            loadSearchSongs({ txt })
        }),
    ).current


    useEffect(() => {
        debouncedSearch(searchInput)
    }, [searchInput])

    function handleSearchChange({ target }) {
        const { value } = target
        setSearchInput(value)
    }

    useEffect(() => {
        if (!station) return

        setIsSearchVisible(songsInStation.length === 0)
    }, [station, songsInStation.length])



    if (!isOwner) return

    return (<section className="station-details__search">
        {songsInStation?.length > 0 && !isSearchVisible && (
            <button
                className="station-details__find-more-btn"
                onClick={() => setIsSearchVisible(true)}
            >
                <span>Find more</span>
            </button>
        )}
        {
            (songsInStation?.length === 0 || isSearchVisible) && (
                <div className="station-details__search-container">
                    <div>
                        <h2>Let's find something for your station</h2>
                        <div className="station-details__search-bar">
                            <span>
                                <IconComp name="search" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search for songs..."
                                value={searchInput}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </div>
                    {songsInStation?.length > 0 && (
                        <button onClick={() => setIsSearchVisible(false)}>
                            <span>
                                <IconComp name="close" />
                            </span>
                        </button>
                    )}
                </div>
            )
        }
        {
            isSearchVisible && searchInput && (
                <div className="station-details__search-results">
                    <SongList songs={searchSongs} isSearchResult />
                </div>
            )
        }
    </section>)
}

