import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'


const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data.user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      logout();
    }
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser().catch(err => console.error('User fetch error:', err));
    }
  }, []);

const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email); // Debug
      const { data } = await api.post('/api/auth/login', { email, password });
      console.log('Login response:', data); // Debug
      
      if (!data || !data.user) {
        console.error('Invalid response structure:', data); // Debug
        throw new Error('Invalid response from server');
      }
  
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Login error:', err); // Debug
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      err.message || 
                      'Login failed';
      throw errorMsg;
    }
};

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
  console.log('Token exists:', !!token);
console.log('User state:', user);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)