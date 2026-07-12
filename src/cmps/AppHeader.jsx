import { Link, NavLink } from "react-router-dom"
import { isCookie, useNavigate, useLocation } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { logout } from "../store/actions/user.actions.js"
import { debounce } from "../services/util.service.js"

import { stationService } from "../services/station"
import { SerachResultsDropdown } from "./SearchResultsDropdown.jsx"

import { IconComp } from "./globalCmps/IconComp.jsx"

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user)

  const [searchTxt, setSearchTxt] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const navigate = useNavigate()
  const location = useLocation()

  const [isOpen, setIsOpen] = useState(false)

  const isHome = location.pathname === `/`

  useEffect(() => {
    async function loadAllStations() {
      const stations = await stationService.query()
      setSearchResults(stations)
    }

    loadAllStations()
  }, [])

  const debouncedSearch = useRef(
    debounce(async (txt) => {
      try {
        const stations = txt.trim()
          ? await stationService.query({ txt })
          : await stationService.query()

        setSearchResults(stations)
      } catch (err) {
        console.error('Cannot search stations', err)
      }
    }, 300)
  ).current

  function handleChange({ target }) {
    const value = target.value

    setSearchTxt(value)      // immediate UI update
    debouncedSearch(value)   // backend search
  }

  async function onLogout() {
    try {
      await logout()
      navigate("/")
      showSuccessMsg(`Bye now`)
    } catch (err) {
      showErrorMsg("Cannot logout")
    }
  }

  return (
    <header className="app-header full">
      <nav>
        <NavLink to="/" className="logo">
          <img src="/logo/meatify-logo.svg" alt="Meatify logo" />
        </NavLink>

        <div className="search-bar-container">
          <div className="app-header__btn">
            <button
              className="btn"
              onClick={() => navigate("/")}>
              {isHome
                ? <IconComp name="home" className="icon--white" /> :
                <IconComp name="home-hollow" className="icon--white" />}

            </button>
          </div>
          <div className="search-bar">
            <button className="btn">
              <IconComp name="search" className="icon--muted" />
            </button>

            <input
              className="search-input"
              type="search"
              name="txt"
              id=""
              placeholder="What do you want to play?"
              value={searchTxt}
              onChange={handleChange}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
            />

            <div className="search-browse-container">
              <button
                className="btn"
                onClick={() => navigate("/browse")}
              >
                <IconComp name="browse" className="icon--muted" />
              </button>
            </div>
            {isOpen && <SerachResultsDropdown stations={searchResults} />}
          </div>
        </div>
        <div className="app-header__user-actions">
          {!user && (
            <NavLink to="auth/login" className="login-link">
              Login
            </NavLink>
          )}
          {user && <>
            <button className="btn">
              <IconComp name="friends" className="icon--sm icon--muted" />
            </button>
            <button className="btn">
              <IconComp name="notification" className="icon--sm icon--muted" />
            </button>

            <div className="user-info app-header__btn">
              <Link to={`user/${user._id}`}>
                {user.imgUrl && <img className="user-info__pic" src={user.imgUrl} />}
              </Link>
            </div>
          </>
          }
        </div>
      </nav>
    </header >
  )
}
