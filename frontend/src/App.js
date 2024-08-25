import React from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import HomePage from "./Pages/home/HomePage"
import LoginPage from "./Pages/auth/login/LoginPage"
import SignUpPage from "./Pages/auth/signup/SignUpPage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from './components/common/RightPanel'
import NotificationPage from './Pages/notification/NotificationPage'
import ProfilePage from './Pages/Profile/ProfilePage'
import { Toaster } from "react-hot-toast";
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner'
import baseUrl from './baseUrl/baseUrl'


const App = () => {

  const {data : authUser , isLoading}= useQuery({
    queryKey : ['authUser'],
    queryFn : async()=>{
      try {
        const res = await fetch(`${baseUrl}/api/auth/me`,{
           credentials: 'include',
        })
        const data = await res.json()
        if(data.error){
          return null;
        }
        if(!res.ok){
          throw new Error(data.error || 'Something went wrong')
        }
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    retry : false,
  })

  if(isLoading){
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size='lg'/>
      </div>
    )
  }
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar/>
      <Routes>
         <Route path='/' element={authUser?<HomePage/> : <Navigate to="/login"/>}/>
         <Route path='/login' element={!authUser ? <LoginPage/> : <Navigate to="/"/> }/>
         <Route path='/signup' element={!authUser ?<SignUpPage/> : <Navigate to="/"/>}/>
         <Route path='/notifications' element={authUser? <NotificationPage/> : <Navigate to="/login"/>}/>
         <Route path='/profile/:username' element={authUser?<ProfilePage/>: <Navigate to="/login"/>}/>
      </Routes>
      {authUser && <RightPanel/>  }
      <Toaster/>
    </div>
  )
}

export default App