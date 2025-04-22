import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

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
    <div className="auth-form">
      <h2>Connexion</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Se connecter</button>
      </form>

      <p>
        Pas encore inscrit ? <a href="/signup">Créer un compte</a>
      </p>
    </div>
  )
}

export default Login
