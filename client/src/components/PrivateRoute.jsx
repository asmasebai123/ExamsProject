import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import React from 'react'


const PrivateRoute = () => {
  const { user } = useAuth()

  return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute