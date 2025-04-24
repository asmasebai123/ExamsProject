import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../styles/Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const user = response; // Modification ici car la réponse est déjà l'objet user
      
      // Redirection selon le rôle
      switch(user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        // ... autres cas
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
};

  return (
    <div className="login-container">
      <h2>LOGIN</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      <div className='footer1'>
        <p>You do not have an account? <a href="/signup">SignUp</a></p>
      </div>
    </div>
  );
};

export default Login;