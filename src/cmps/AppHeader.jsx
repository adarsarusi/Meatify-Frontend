import { Link, NavLink } from "react-router-dom"
import { isCookie, useNavigate } from "react-router"
import { useSelector, useDispatch } from "react-redux"
import { useState, useRef, useEffect } from "react"

import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { logout } from "../store/actions/user.actions.js"
import { debounce } from "../services/util.service.js"

import { SerachResultsDropdown } from "./SearchResultsDropdown.jsx"

import { SET_FILTER_BY } from "../store/reducers/station.reducer.js"
import { loadStations } from "../store/actions/station.actions.js"
import { IconComp } from "./globalCmps/IconComp.jsx"

export function AppHeader() {
  const user = useSelector((storeState) => storeState.userModule.user)
  const filterBy = useSelector((state) => state.stationModule.filterBy)
  const stations = useSelector((state) => state.stationModule.stations)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [isOpen, setIsOpen] = useState(false)
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

  const debouncedApplyFilter = useRef(
    debounce((updatedFilter) => {
      dispatch({ type: SET_FILTER_BY, filterBy: updatedFilter })
    }, 500),
  ).current

  useEffect(() => {
    debouncedApplyFilter(filterByToEdit)
  }, [filterByToEdit])

  useEffect(() => {
    loadStations(filterBy)
  }, [filterBy])

  function handleChange({ target }) {
    const { name, value } = target

    setFilterByToEdit((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }))
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
          <IconComp name="spotify-logo" className="icon--white icon--lg" />
        </NavLink>

        <div className="search-bar-container">
          <div className="app-header__btn">
            <button
              className="search-bar__btn img-btn"
              onClick={() => navigate("/")}>
              <IconComp name="home" className="icon--white" />
            </button>
          </div>
          <div className="search-bar">
            <button className="search-bar__btn img-btn">
              <IconComp name="search" className="icon--muted" />
            </button>

            <input
              className="search-input"
              type="search"
              name="txt"
              id=""
              placeholder="What do you want to play?"
              value={filterByToEdit.txt}
              onChange={handleChange}
              onFocus={() => setIsOpen(true)}
              onBlur={() => setIsOpen(false)}
            />

            <div className="search-browse-container">
              <button
                className="browse-search-btn search-bar__btn img-btn"
                onClick={() => navigate("/browse")}
              >
                <IconComp name="browse" className="icon--muted" />
              </button>
            </div>
            <SerachResultsDropdown stations={stations} />
          </div>
        </div>

        {!user && (
          <NavLink to="auth/login" className="login-link">
            Login
          </NavLink>
        )}
        {user && (
          <div className="user-info app-header__btn">
            <Link to={`user/${user._id}`}>
              {user.imgUrl && <img className="user-info__pic" src={user.imgUrl} />}
            </Link>
          </div>
        )}
      </nav>
    </header >
  )
}
