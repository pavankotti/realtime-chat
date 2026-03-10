import React from 'react'
import './App.css'
import MainContainer from './components/layout/MainContainer'
import LoginPage from './components/auth/LoginPage'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useThemeSync from './hooks/useThemeSync'
import SignUp from './components/auth/SignUp'

function App() {
  const isLight = useSelector(state => state.themeToggle.isLight)
  // console.log(isLight)

  useThemeSync(isLight)

  return (
    <div className="
      font-sans
      flex justify-center items-center
      bg-body 
      min-h-screen
      transition-colors
    ">
      <div className="
        flex gap-0
        w-[95vw] h-[95vh] md:w-[90vw] md:h-[90vh]
        bg-container 
        rounded-2xl
        ring-1 ring-border-subtle
        shadow-2xl
        overflow-hidden
        transition-colors
      ">
        <Routes>
          <Route path="/" 
          element={localStorage.getItem("userInfo")?
           <Navigate to="/app" />: <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/app" element={<MainContainer />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </div>
    </div>
  )
}

export default App