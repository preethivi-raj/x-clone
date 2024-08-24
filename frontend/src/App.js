import React from 'react'
import { Routes,Route } from 'react-router-dom'
import HomePage from "./Pages/home/HomePage"
import LoginPage from "./Pages/auth/login/LoginPage"
import SignUpPage from "./Pages/auth/signup/SignUpPage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from './components/common/RightPanel'
import NotificationPage from './Pages/notification/NotificationPage'
import ProfilePage from './Pages/Profile/ProfilePage'
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar/>
      <Routes>
         <Route path='/' element={<HomePage/>}/>
         <Route path='/login' element={<LoginPage/>}/>
         <Route path='/signup' element={<SignUpPage/>}/>
         <Route path='/notifications' element={<NotificationPage/>}/>
         <Route path='/profile/:username' element={<ProfilePage/>}/>
      </Routes>
      <RightPanel/>
      <Toaster/>
    </div>
  )
}

export default App