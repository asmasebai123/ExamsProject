import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import React from 'react'


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me')
      setUser(data.user)
    } catch (err) {
      logout()
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      navigate('/')
    } catch (err) {
      throw err.response?.data?.message || 'Login failed'
    }
  }

  const signup = async (userData) => {
    try {
      const { data } = await api.post('/api/auth/signup', userData)
      localStorage.setItem('token', data.token)
      setToken(data.token)
      setUser(data.user)
      navigate('/')
    } catch (err) {
      throw err.response?.data?.message || 'Registration failed'
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)