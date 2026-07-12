import { IconComp } from "./globalCmps/IconComp"
import SongList from "./globalCmps/SongList"
import { debounce } from "../services/util.service"
import { useEffect, useRef, useState } from "react"
import { loadSongs } from "../store/actions/song.actions"
import { useSelector } from "react-redux"

export function StationSearchMore({ station, songs }) {

    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [searchedSong, setSearchedSong] = useState("")


    const currentStation = useSelector(
        (storeState) => storeState.stationModule.selectedStation,
    )

    const loggedinUser = useSelector(
        storeState => storeState.userModule.user
    )

    const isOwner = currentStation.createdBy.fullname === loggedinUser.fullname

    const debouncedSearch = useRef(
        debounce((txt) => {
            loadSongs({ txt })
        }),
    ).current


    useEffect(() => {
        debouncedSearch(searchedSong)
    }, [searchedSong])

    function handleSearchChange({ target }) {
        const { value } = target
        setSearchedSong(value)
    }

    useEffect(() => {
        if (!station) return

        if (station.songs?.length === 0) {
            setIsSearchVisible(true)
        } else {
            setIsSearchVisible(false)
        }
    }, [station])



    if (!isOwner) return

    return (<section className="station-details__search">
        {station.songs?.length > 0 && !isSearchVisible && (
            <button
                className="station-details__find-more-btn"
                onClick={() => setIsSearchVisible(true)}
            >
                <span>Find more</span>
            </button>
        )}
        {
            (station.songs?.length === 0 || isSearchVisible) && (
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
            )
        }
        {
            isSearchVisible && searchedSong && (
                <div className="station-details__search-results">
                    <SongList songs={songs} isSearchResult={true} />
                </div>
            )
        }
    </section>)
}

