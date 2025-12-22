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
      flex justify-center items-center
      bg-body 
      min-h-screen
      transition-colors
    ">
      <div className="
        flex gap-4
        w-[95vw] h-[95vh] md:w-[90vw] md:h-[90vh]
        bg-container 
        rounded-3xl p-3 md:p-4
        shadow-elevated
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