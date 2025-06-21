import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router"
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Features from './pages/Features'

const App = () => {
  return (
   <Router>
    <Toaster/>
    <Navbar/>
    <Routes>
      <Route path="" element={<Landing></Landing>}/>
      <Route path="/features" element={<Features></Features>}/>
      <Route path="/login" element={<Login></Login>}/>
      <Route path="/register" element={<Register></Register>}/>
    </Routes>
   </Router>
  )
}

export default App
