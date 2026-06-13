import React from 'react'
import { Routes, Route } from 'react-router'

function App() {

  return <div className="main-container">
    {/* <AppHeader />
    <UserMsg /> */}

    <main>
      <Routes>
        {/* <Route path="" element={<HomePage />} />
        <Route path="user/:id" element={<UserDetails />} /> */}
        {/* <Route path="auth" element={<LoginSignup />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route> */}
      </Routes>
    </main>
    {/* <AppFooter /> */}
  </div>
}

export default App
