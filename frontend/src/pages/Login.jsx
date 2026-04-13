import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css';

// We pass setUser as a prop so we can update the App when someone logs in
const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      // Save the token and user data to local storage so they stay logged in after refreshing
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data); // Update the global state
      
      navigate('/'); // Redirect to home page
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Check credentials.');
    }
  };

  return (
    <div className="auth-container">
      {/* Added glass-panel class here */}
      <div className="auth-card glass-panel">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input type="email" name="email" placeholder="Email Address" required onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
          <button type="submit" className="btn auth-btn">Log In</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </div>
  );
};

export default Login;