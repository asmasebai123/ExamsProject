import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import "../../styles/signup.css"

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "", // ex: "student"
        department: ""
      });
  const [error, setError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Signup successful:', data);
      // Handle successful signup (redirect, etc.)
      
    } catch (err) {
      console.error('Signup error:', err);
      // Show error to user
      setError(err.message || 'Signup failed. Please try again.');
    }
  }
  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} method="POST">
        
          <input
            placeholder='Write your first name'
            type="text"
            name="firstName"
            id="FirstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        
        
          <input
            placeholder='Write your last name '
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        
        
          <input
            placeholder='Write your email'
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
       
        
          <input
            placeholder='Password'
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        <select
          value={formData.role}
          id="role"
          name="role"
          onChange={handleChange}>
          <option value="" disabled>
            Select your role
          </option>
          <option value="study_director">Directeur des études</option>
          <option value="department_head">Chef département</option>
          <option value="admin">Administrateur</option>
        </select>
      
        <button type="submit">Sign Up</button>
      </form>
      <br />
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  )
}

export default Signup