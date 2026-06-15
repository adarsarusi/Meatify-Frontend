import React from "react"

import { BrowserRouter as Router } from "react-router-dom"
import { Routes, Route } from "react-router-dom"

import { AppHeader } from "./cmps/AppHeader.jsx"
import { HomePage } from "./pages/HomePage.jsx"
function App() {
  return (
    <Router>
      <div className="main-container">
        <AppHeader />
        {/* <UserMsg /> */}

        <main>
          <Routes>
            <Route path="" element={<HomePage />} />
        {/* <Route path="user/:id" element={<UserDetails />} /> */}
            {/* <Route path="auth" element={<LoginSignup />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          </Route> */}
          </Routes>
        </main>
        {/* <AppFooter /> */}
      </div>
    </Router>
  )
}

export default App
