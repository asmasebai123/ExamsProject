import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import React from 'react'


const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="logo">Exam Calendar</Link>
        <div className="nav-links">
          {user ? (
            <button onClick={logout} className="btn-logout">Logout</button>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar