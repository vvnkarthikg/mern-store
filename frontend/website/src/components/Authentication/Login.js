import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios'; // Ensure axios is imported
import './Login.css';

const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(''); // State for error message
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/signin`, { // Use backticks here
        email,
        password,
      });

      // Store the token in local storage
      localStorage.setItem('token', response.data.token);
      
      // Check if user data exists and store admin status
      localStorage.setItem('isAdmin', response.data.isAdmin);

      // Redirect to home page on successful login
      navigate('/'); 
    } catch (err) {
      console.log('Login failed:', err);
      setError('Login failed. Please check your credentials.'); // Set error message
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        {/* Background image can go here */}
      </div>
      <div className="auth-right">
        <form onSubmit={handleSubmit} className="auth-form">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>} {/* Display error message */}
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
          <p className="switch-text">Don't have an account? 
            <button type="button" onClick={onSwitchToSignup} className="switch-btn">Signup</button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
