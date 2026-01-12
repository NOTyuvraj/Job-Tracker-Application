import React from 'react'
import {Jobs} from "./pages/Jobs.jsx"
import {Login} from "./pages/Login.jsx"
import {Signup} from "./pages/Signup.jsx"
import { BrowserRouter , Routes , Route , Navigate } from "react-router-dom";
import { ProtectedRoutes } from './components/ProtectedRoutes.jsx';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element = {<Login/>}/>
        <Route path='/signup' element = {<Signup/>}/>
        <Route path='/jobs' element = {
          <ProtectedRoutes>
            <Jobs />
          </ProtectedRoutes>
        }/>
        <Route path='*' element = {<Navigate to="/login" replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}
