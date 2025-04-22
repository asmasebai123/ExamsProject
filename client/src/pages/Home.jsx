import { useAuth } from '../context/AuthContext'
import React from 'react'


const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home-page">
      <h1>Welcome {user?.firstName || 'to Exam Calendar'}</h1>
      <p>Manage your exams and surveillance schedules efficiently</p>
      
      {user && (
        <div className="user-info">
          <p>Email: {user.email}</p>
          <p>Role: {user.role}</p>
        </div>
      )}
    </div>
  )
}

export default Home