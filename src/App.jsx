import React from "react"
import { useSelector } from 'react-redux'

import { BrowserRouter as Router } from "react-router-dom"
import { Routes, Route } from "react-router-dom"

import { AppHeader } from "./cmps/AppHeader.jsx"
import { AppContainer } from "./pages/AppContainer.jsx"
import { Explore } from "./pages/Explore.jsx"
import { Browse } from "./pages/Browse.jsx"
import { Library } from "./cmps/Library.jsx"
import { ArtistInfo } from "./cmps/ArtistInfo.jsx"
import { StationDetails } from "./pages/StationDetails.jsx"
import { Profile } from "./pages/Profile.jsx"
import { SongDetails } from "./pages/SongDetails.jsx"


import { PlayBar } from "./cmps/PlayBar.jsx"
function App() {

  const isExpanded = useSelector(storeState => storeState.systemModule.isExpanded)

  return (
    <Router>
      <div className="main-container">
        <AppHeader />
        {/* <UserMsg /> */}

        <main className={isExpanded ? 'app-layout expanded' : 'app-layout'}>
          <Library />
          <Routes>
            {/* explore, browse, stationdetails, songdetails - dynamic area */}
            <Route path="/" element={<Explore />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="station/:id" element={<StationDetails />} />
            <Route path="user/:id" element={<Profile />} />
            <Route path="song/:id" element={<SongDetails />} />
          </Routes>
          <ArtistInfo />
        </main>
        <PlayBar />
      </div>
    </Router>
  )
}

export default App
