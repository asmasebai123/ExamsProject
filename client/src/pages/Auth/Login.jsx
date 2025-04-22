import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import "../../styles/Login.css"

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const user = await login(email, password) // Récupère l'utilisateur après login

      // Redirection selon le rôle de l'utilisateur
      if (user.role === 'admin') {
        navigate('/admin')
      } else if (user.role === 'student') {
        navigate('/student')
      } else {
        navigate('/') // Fallback
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    }
  }

  return (
    <div className="login-container">
      <h2>LOGIN</h2>
      {error && <p className="error">{error}</p>}
      <form d="loginForm" onSubmit={handleSubmit} method="POST">
        <input
            type="email"
            placeholder="Email"
            value={email}
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

        <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
        />
        <button type="submit">Login</button>
      </form>
      
      <div className='footer1' >
        <p>You do not have an accout ? <a href="/signup">SignUp</a></p>
      </div>
    </div>
      
   
  )
}

export default Login
