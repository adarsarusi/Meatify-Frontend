import { NavLink, useLocation } from "react-router-dom"
import { IconComp } from "../cmps/globalCmps/IconComp"

export function MobileDock() {

    const location = useLocation()

    const index = {
        "/": 0,
        "/search": 1,
        "/library": 2,
        "/browse": 3,
    }[location.pathname] ?? 0

    return (
        <nav className="mobile-dock">

            <div
                className="active-pill"
                style={{
                    transform: `translateX(${index * 100}%)`
                }}
            />

            <NavLink to="/"
                className={({ isActive }) => isActive ? "active" : ""}>
                <div>
                    <IconComp name="home-hollow" />
                </div>
                <span>Explore</span>
            </NavLink>

            <NavLink to="/search"
                className={({ isActive }) => isActive ? "active" : ""}>
                <div>
                    <IconComp name="search" />
                </div>
                <span>Search</span>
            </NavLink>

            <NavLink to="/library"
                className={({ isActive }) => isActive ? "active" : ""}>
                <div>
                    <IconComp name="library" />
                </div>
                <span>Library</span>
            </NavLink>

            <NavLink to="/browse"
                className={({ isActive }) => isActive ? "active" : ""}>
                <div>
                    <IconComp name="browse-hollow" />
                </div>
                <span>Browse</span>
            </NavLink>


        </nav>
    )
}