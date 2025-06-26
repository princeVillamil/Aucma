import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import React from 'react'
import HomePage from './pages/HomePage'

function App() {

  return (
    
    <>
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </>
    
  )
}

export default App
